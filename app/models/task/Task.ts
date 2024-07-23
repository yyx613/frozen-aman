import { SnapshotIn, destroy, types } from 'mobx-state-tree'

export const TaskProductModel = types.
    model('Product')
    .props(
        {
            id: types.identifierNumber,
            code: types.maybeNull(types.string),
            name: types.maybeNull(types.string),
            price: types.maybeNull(types.number)
        }
    )

export const FOCProductModel = types.
    model('FOCProduct')
    .props({
        id: types.maybeNull(types.number),
        product_id: types.identifierNumber,
        customer_id: types.maybeNull(types.number),
        achievequantity: types.maybeNull(types.number),
        quantity: types.maybeNull(types.number),
        free_product_id: types.maybeNull(types.number),
        free_quantity: types.maybeNull(types.number),
        startdate: types.maybeNull(types.string),
        enddate: types.maybeNull(types.string),
    })

export const TaskGroupCompany = types.model('GroupCompany')
    .props({
        id: types.maybeNull(types.number),
        code: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        ssm: types.maybeNull(types.string),
        address1: types.maybeNull(types.string),
        address2: types.maybeNull(types.string),
        address3: types.maybeNull(types.string),
        address4: types.maybeNull(types.string),
        group_id: types.maybeNull(types.number),
    })

export const TaskCustomerModel = types.
    model('Customer')
    .props({
        id: types.identifierNumber,
        code: types.maybeNull(types.string),
        company: types.maybeNull(types.string),
        paymentterm: types.maybeNull(types.number),
        phone: types.maybeNull(types.string),
        address: types.maybeNull(types.string),
        status: types.maybeNull(types.number),
        activefoc: types.maybeNull(types.array(FOCProductModel)),
        product: types.maybeNull(types.array(TaskProductModel)),
        credit: types.maybeNull(types.number),
        groupcompany: types.maybeNull(TaskGroupCompany)
    })

export const TaskInvoiceDetailsModel = types.model('TaskInvoiceDetails')
    .props({
        id: types.identifierNumber,
        product_id: types.maybeNull(types.number),
        quantity: types.maybeNull(types.number),
        price: types.maybeNull(types.number),
        totalprice: types.maybeNull(types.number),
        product: types.maybe(TaskProductModel)
    })

export const TaskInvoiceModel = types.
    model('TaskInvoice')
    .props({
        invoiceno: types.maybeNull(types.string),
        date: types.maybeNull(types.string),
        remark: types.maybeNull(types.string),
        invoicedetail: types.array(TaskInvoiceDetailsModel)
    })
export const TaskModel = types.
    model('Task')
    .props({
        id: types.identifierNumber,
        date: types.maybeNull(types.string),
        customer_id: types.maybeNull(types.number),
        sequence: types.maybeNull(types.number),
        invoice_id: types.maybeNull(types.number),
        status: types.maybeNull(types.number),
        customer: types.maybe(TaskCustomerModel),
        invoice: types.maybeNull(TaskInvoiceModel),
        based: types.number
    })
    .actions((self) => ({
        remove() {
            destroy(self)
        },
        updateTaskStatus(status) {
            self.status = status
        },
        udpateNewCredit(newCredit) {
            self.customer.credit = newCredit
        }
    }))

export interface TaskSnapshotIn extends SnapshotIn<typeof TaskModel> { }
