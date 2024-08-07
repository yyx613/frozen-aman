import { detach, flow, getParent, Instance, SnapshotOut, types } from "mobx-state-tree"
import { DriverModel } from "../driver"
import {
  callRequestStockTransfer,
  callStocks,
  callStockTransactionHistory,
  callStockTransferHistory,
  updateStockTransferTask,
} from "app/services/api"
import { CartEntry, StockModel, StockTransactionsModel, StockTransferTaskModel } from "./Stock"
import { Alert } from "react-native"
import moment from "moment"
import { RootStoreModel } from "../RootStore"


export const StockStoreModel = types
  .model("StockStore")
  .props({
    stocks: types.array(StockModel),
    stockTransaction: types.array(StockTransactionsModel),
    stockTransferTask: types.maybeNull(types.maybe(StockTransferTaskModel)),
    cart: types.array(CartEntry),
    selectedDriver: types.maybeNull(types.reference(DriverModel)),
    isLoading: false
  })
  .views((self) => ({
    getTotal() {
      return getTotalItems(self.cart)
    },
    getApproveStockTransferTask() {
      if (!self.stockTransferTask) {
        return []
      }
      const approveTasks = self.stockTransferTask.pending
      return approveTasks
        .reduce((result, item) => {

          let section = result.find((section) => section.status === item.status);
          if (!section) {
            section = {
              status: item.status,
              data: []
            };
            result.push(section);
          }

          section.data.push(item);
          return result;
        }, []);
    },
    getRequestStockTransferTask() {
      if (!self.stockTransferTask) {
        return []
      }
      const requestTask = self.stockTransferTask.request
      return requestTask
        .reduce((result, item) => {

          let section = result.find((section) => section.status === item.status);
          if (!section) {
            section = {
              status: item.status,
              data: []
            };
            result.push(section);
          }

          section.data.push(item);
          return result;
        }, []);
    },
    getStockInTransactions() {
      if (!self.stockTransaction) {
        return []
      }
      const list = self.stockTransaction.filter((item) => item.quantity > 0)
      return list
        .reduce((result, item) => {

          let section = result.find((section) => section.type === item.type);
          if (!section) {
            section = {
              type: item.type,
              data: []
            };
            result.push(section);
          }

          section.data.push(item);
          return result;
        }, []);
    },
    getStockOutTransactions() {
      if (!self.stockTransaction) {
        return []
      }
      const list = self.stockTransaction.filter((item) => item.quantity < 0)
      return list
        .reduce((result, item) => {

          let section = result.find((section) => section.type === item.type);
          if (!section) {
            section = {
              type: item.type,
              data: []
            };
            result.push(section);
          }

          section.data.push(item);
          return result;
        }, []);
    },
    getPendingApproveStockTransferTaskById(id) {
      return self.stockTransferTask?.pending.find(item => item.id === id)
    },
    getRequestStockTransferTaskById(id) {
      return self.stockTransferTask?.request.find(item => item.id === id)
    },
    getFormattedCartDetails() {
      return formatStockTransferCartDetails(self.cart)
    },


  }))
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading
    }

    function updateStockCart(item) {
      let product = self.cart.find((x) => x.product_id === item.product_id)
      if (!product) {
        self.cart.push({ ...item })
        product = self.cart[self.cart.length - 1]
      }
      product.setQuantity(item.cart)
      if (item.cart === 0) product.remove()
    }

    function updateSelectedDriver(driver) {
      self.selectedDriver = driver
    }

    function reset() {
      self.cart.clear()
      self.stocks.clear()
      self.selectedDriver = null
    }

    function resetCart() {
      self.cart.clear()

    }

    const loadStocks = flow(function* loadProducts() {
      markLoading(true)
      const rootStore = getParent<typeof RootStoreModel>(self)
      const pendingOrders = rootStore.getPendingOrdes()

      console.log('pendingOrders', pendingOrders.toJSON())

      if (pendingOrders?.length !== 0) {
        
        const pendingOrderResponse = yield rootStore.submitPendingOrders()
        console.log('response', pendingOrderResponse)

        if (pendingOrderResponse?.kind !== 'ok') {
          markLoading(false)
          return pendingOrderResponse
        }
      }

      const response = yield callStocks()
      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching product list: ${JSON.stringify(response)}`, [])
        self.stocks.clear()
        Alert.alert(response.message)
        markLoading(false)
        return response
      }
      self.stocks = response.data
      markLoading(false)
      return response
    })

    const loadStockTransferTask = flow(function* loadStockTransferTask() {
      markLoading(true)
      const response = yield callStockTransferHistory()
      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching stock transfer list: ${JSON.stringify(response)}`, [])
        Alert.alert(response.message)
        self.stockTransaction.clear()
        markLoading(false)
        return response
      }
      console.log('response', response.data)
      markLoading(false)

      self.stockTransferTask = response.data
      return response
    })

    const updateStockTransfer = flow(function* updateStockTransfer({ id, status }) {
      markLoading(true)
      const response = yield updateStockTransferTask({ id, status })
      if (response.kind !== 'ok') {
        console.tron.error(`Error update stock transfer: ${JSON.stringify(response)}`, [])
        markLoading(false)
        Alert.alert(response.message)
        return response
      }
      markLoading(false)
      Alert.alert(response.data)
    })

    const requestStockTransfer = flow(function* requestStockTransfer({ id, transferDetail }) {
      markLoading(true)
      const response = yield callRequestStockTransfer({ id, transferDetail })
      if (response.kind !== 'ok') {
        console.tron.error(`Error request stock transfer: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return response
      }
      markLoading(false)
      return response
    })

    const loadStockTransaction = flow(function* loadStockTransaction(date) {
      const formattedDate = moment(date).format('YYYY-MM-DD')
      markLoading(true)
      const response = yield callStockTransactionHistory(formattedDate)
      if (response.kind !== 'ok') {
        console.tron.error(`Error request stock transaction: ${JSON.stringify(response)}`, [])
        Alert.alert(response.message)
        self.stockTransaction.clear()
        markLoading(false)
        return response
      }
      markLoading(false)
      self.stockTransaction = response.data
      return response
    })
    function resetStore() {
      self.stocks.clear()
      self.stocks.clear()
      self.stockTransaction.clear()
      self.stockTransferTask = undefined
      self.cart.clear()
      self.selectedDriver = undefined
      self.isLoading = false
    }

    return {
      updateSelectedDriver,
      updateStockCart,
      loadStocks,
      loadStockTransferTask,
      loadStockTransaction,
      updateStockTransfer,
      reset,
      resetCart,
      resetStore,
      requestStockTransfer
    }
  })

export interface StockStore extends Instance<typeof StockStoreModel> {
}

export interface StockStoreSnapshot extends SnapshotOut<typeof StockStoreModel> {
}


function getTotalItems(cart) {
  return cart.reduce((total, product) => total + product.cart, 0)
}


function formatStockTransferCartDetails(cart) {
  return cart.map((item) => ({
    quantity: item.cart,
    ...item
  }))
}
