import { RootStoreModel } from "../RootStore"
import { flow, getParent, Instance, types } from "mobx-state-tree"
import { TaskModel } from "../task"
import {
    FOCModel,
    OrderCartModel,
    OrderInvoiceModel,
    PendingOrderModel,
    ReturnCartModel,
    ReturnInvoiceModel,
} from "./Order"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { callAddInvoice } from "app/services/api/task"
import Moment from "moment/moment"
import { DELIVERY } from "app/screens/DeliveryRoute/constant"
import { algorithm } from "app/utils"
import { callReturnStocks } from "../../services/api"

const PAY_BY_CREDIT = 2
const TRANSACTION_TYPE={
    ORDER: 'order',
    RETURN: 'return'
}

export const OrderStoreModel = types
    .model("OrderStore")
    .props({
        cart: types.array(OrderCartModel),
        foc: types.array(FOCModel),
        selectedTask: types.maybe(types.reference(TaskModel)),
        receiptDetails: types.maybe(OrderInvoiceModel),
        returnReceiptDetails: types.maybe(ReturnInvoiceModel),
        pendingOrders: types.array(PendingOrderModel),
        isLoading: false,
        invoiceRunningNumber: types.maybeNull(types.string),
        returnCart: types.array(ReturnCartModel),
    })
    .views((self) => {
        function getTotalPrice() {
            return self.cart.reduce((total, product) => total + (product.price * product.quantity), 0)
        }
        function getTotalItem() {
            return self.cart.reduce((total, product) => total + product.cart, 0)
        }

        function getReturnTotalPrice() {
            return self.returnCart.reduce((total, product) => total + (product.price * product.quantity), 0)
        }
        function getReturnTotalItem() {
            return self.returnCart.reduce((total, product) => total + product.cart, 0)
        }

        return {
            getTotalPrice,
            getTotalItem,
            getReturnTotalPrice,
            getReturnTotalItem,
        }
    })
    .actions(withSetPropAction)
    .actions((self) => {
        function markLoading(loading) {
            self.isLoading = loading
        }

        function updateCartWithExistingInvoice(invoice) {
            const formattedInvoice = formatInvoiceDetails(invoice)
            self.cart = formattedInvoice

        }
        function updateOrderCart(selectedProduct) {
            const { name, cart } = selectedProduct
            let product = self.cart.find((item) => item.name === name)
            if (!product) {
                self.cart.push(selectedProduct)
                product = self.cart[self.cart.length - 1]
            }
            product.setQuantity(cart)
            if (cart === 0) product.remove()
        }

        function updateReturnCart(selectedProduct) {
            const { name, cart } = selectedProduct
            let product = self.returnCart.find((item) => item.name === name)
            if (!product) {
                self.returnCart.push(selectedProduct)
                product = self.returnCart[self.returnCart.length - 1]
            }
            product.setQuantity(cart)
            if (cart === 0) product.remove()
        }
        function updateSelectedTask(task) {
            self.selectedTask = undefined
            self.selectedTask = task

        }

        function getNewCredit(paymentType, transactionType= TRANSACTION_TYPE.ORDER) {
            if (paymentType === PAY_BY_CREDIT) {
                const prevCredit=  self.selectedTask.customer.credit
                const newCredit = transactionType === TRANSACTION_TYPE.ORDER? prevCredit+ self.getTotalPrice() : prevCredit - self.getReturnTotalPrice()
                getParent<typeof RootStoreModel>(self).updateCustomerCreditByTaskId({ id: self.selectedTask.id, newCredit })
                return newCredit
            }
            return self.selectedTask.customer.credit
        }

        function checkFOC() {
            const { activefoc } = self.selectedTask.customer
            const stocks = getParent<typeof RootStoreModel>(self).getStock()

            if (activefoc.length === 0) return self.setProp('foc', [])
            const focList = activefoc.reduce((result, item) => {
                const foundCartItem = self.cart.find((order) => order.product_id === item.product_id)
                if (!foundCartItem) return result
                const isQualifyFOC = item.achievequantity + foundCartItem.cart >= item.quantity
                if (!isQualifyFOC) return result
                const foundStock = stocks.find((stcok) => stcok.product_id === item.product_id)
                const isEnoughStock = foundCartItem.cart + item.free_quantity <= foundStock.quantity
                if (!isEnoughStock) return result

                const foc = {
                    product_id: item.product_id,
                    name: foundCartItem.name,
                    quantity: item.free_quantity,
                    totalprice: 0,
                    price: 0,
                    foc: true
                }
                result.push(foc)
                return result
            }, [])
            self.setProp('foc', focList)
        }

        function updateStocks(stocks, orders) {
            const updatedList = stocks.map(obj => ({
                ...obj,
                quantity: obj.quantity - orders.reduce((total, otherObj) => {
                    if (obj.id === otherObj.id) {
                        return total + otherObj.quantity;
                    }
                    return total;
                }, 0)
            }));
            getParent<typeof RootStoreModel>(self).updateStocks(updatedList)
        }

        function updateReceiptDetails({ invoiceNo, paymentType, remark, date }) {

            const receiptDetails = {
                invoiceNo,
                paymentType,
                date,
                customer: self.selectedTask.customer.company,
                address: self.selectedTask.customer.address,
                amount: self.getTotalPrice().toFixed(2).toString(),
                newCredit: getNewCredit(paymentType),
                groupCompany: { ...self.selectedTask.customer.groupcompany },
                invoiceDetail: [...formatCartList(self.cart), ...formatFOCList(self.foc)],
                remark
            }
            self.setProp('receiptDetails', receiptDetails)
        }

        function generateInvoiceNo(IPAddress) {
            const rootStore = getParent<typeof RootStoreModel>(self)
            const employeeId = rootStore.getCurrentUser().employeeid?.slice(-3)
            const ipAddress = IPAddress?.replace(/[^\w ]/g, '')?.slice(-3)
            const runningNumber = algorithm.padWithLeadingZeros(Number(self.invoiceRunningNumber) + 1, 6)
            rootStore.updateInvoiceRunningNumber(runningNumber)
            self.invoiceRunningNumber = runningNumber
            return `${employeeId}${ipAddress}${runningNumber}`
        }

        function addPendingOrders({ remark, paymentType, invoiceDetail, IPAddress, date }) {
            const rootStore = getParent<typeof RootStoreModel>(self)
            const stocks = rootStore.getStock()
            const invoiceNo = generateInvoiceNo(IPAddress)

            const pendingOrder = {
                date,
                customerName: self.selectedTask.customer.company,
                customerId: self.selectedTask.customer_id,
                invoiceId: self.selectedTask.invoice_id ?? null,
                invoiceNo,
                paymentType,
                remark,
                invoiceDetail
            }
            self.pendingOrders.push(pendingOrder)
            updateStocks(stocks, invoiceDetail)
            updateReceiptDetails({ invoiceNo, paymentType, remark, date })
            rootStore.updateTaskList({ id: self.selectedTask.id, status: DELIVERY.COMPLETED_STATUS })
            markLoading(false)
            console.log('pendingOrders', self.pendingOrders.toJSON())
            return { kind: 'pending', message: 'You are currently offline, added task to pending submission list' }
        }

        const submit = flow(function* submit(item) {
            const response = yield callAddInvoice({ ...item })
            console.log('submitPeding', response)
            if (response.kind !== 'ok') {
                return
            }
            item.remove()
        })

        const submitPendingTask = flow(function* submitPendingTask() {
            const pendingOrders = [...self.pendingOrders]
            console.log('pendingOrders2', pendingOrders)

            for (let i = 0; i < pendingOrders.length; i++) {
                yield submit(pendingOrders[i])
            }

            console.log('pendingOrders', self.pendingOrders)
            if (self.pendingOrders.length === 0) {
                self.pendingOrders.clear()
                return { kind: 'ok' }
            }
            return { kind: 'pendingOrderError' }
        })

        const addInvoice = flow(function* addInvoice({ remark, paymentType, invoiceNo, isConnected, IPAddress, date }) {
            markLoading(true)
            const rootStore = getParent<typeof RootStoreModel>(self)
            const stocks = rootStore.getStock()
            const orders = [...formatCartList(self.cart), ...formatFOCList(self.foc)]
            console.log('date', date)

            // check if is offline
            if (!isConnected) {
                return addPendingOrders({ remark, paymentType, invoiceDetail: orders, IPAddress, date })
            }

            const response = yield callAddInvoice({
                date,
                customerId: self.selectedTask.customer_id,
                invoiceId: self.selectedTask.invoice_id ?? null,
                invoiceNo: invoiceNo ?? null,
                paymentType,
                remark,
                invoiceDetail: orders
            })

            if (response.kind !== 'ok') {
                console.tron.error(`Error update add invoice: ${JSON.stringify(response)}`, [])
                markLoading(false)
                return response
            }
            console.log('invoiceResponse', response)
            updateStocks(stocks, orders)
            updateReceiptDetails({ invoiceNo: response.data.invoiceno, paymentType, remark, date })
            rootStore.updateTaskList({ id: self.selectedTask.id, status: DELIVERY.COMPLETED_STATUS })
            markLoading(false)
            return response
        })

        function updateReturnReceiptDetails({ returnNo, paymentType, remark, date }) {

            const receiptDetails = {
                returnNo,
                paymentType,
                date,
                customer: self.selectedTask.customer.company,
                address: self.selectedTask.customer.address,
                amount: self.getReturnTotalPrice().toFixed(2).toString(),
                newCredit: getNewCredit(paymentType, TRANSACTION_TYPE.RETURN),
                groupCompany: { ...self.selectedTask.customer.groupcompany },
                invoiceDetail: [...formatReturnCartList(self.returnCart)],
                remark
            }
            self.setProp('returnReceiptDetails', receiptDetails)
        }


        const returnStocks = flow(function* returnStocks({ remark, paymentType, date }) {
            markLoading(true)
            const returnCart = [...formatReturnCartList(self.returnCart)]

            // // check if is offline
            // if (!isConnected) {
            //     return addPendingOrders({ remark, paymentType, invoiceDetail: returnCart, IPAddress, date })
            // }

            const response = yield callReturnStocks({
                date,
                customerId: self.selectedTask.customer_id,
                paymentType,
                remark,
                returnDetail: returnCart,
                returnId: null,
                returnNo: ''
            })

            if (response.kind !== 'ok') {
                console.tron.error(`Error update add invoice: ${JSON.stringify(response)}`, [])
                markLoading(false)
                return response
            }
            console.log('returnResponse', response)
            updateReturnReceiptDetails({ returnNo: response.data.returnno, paymentType, remark, date })
            markLoading(false)
            return response
        })

        function reset() {
            self.cart.clear()
            self.foc.clear()
            self.returnCart.clear()
            self.receiptDetails = undefined
        }

        return {
            updateOrderCart,
            updateReturnCart,
            updateSelectedTask,
            updateCartWithExistingInvoice,
            checkFOC,
            reset,
            addInvoice,
            submitPendingTask,
            markLoading,
            returnStocks,
        }
    })

export interface OrderStore extends Instance<typeof OrderStoreModel> { }

function formatCartList(cart) {
    return cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        totalprice: item.totalprice,
        foc: false
    }))
}

function formatFOCList(cart) {
    return cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: 0,
        totalprice: 0,
        foc: true
    }))
}

function formatInvoiceDetails(invoice) {
    return invoice.map((item) => ({
        name: item.product.name,
        ...item
    }))

}


function formatReturnCartList(cart) {
    return cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        totalprice: item.totalprice,
    }))
}
