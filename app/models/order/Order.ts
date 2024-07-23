import { destroy, SnapshotIn, types } from "mobx-state-tree"

export const OrderCartModel = types
  .model("OrderCart")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    cart: types.maybeNull(types.number),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
    foc: false
  })
  .views((self) => ({
    get productPrice() {
      return (self.price * self.cart).toFixed(2)
    },
  }))
  .actions((self) => ({
    increaseQuantity(number) {
      self.cart += number
      self.quantity += number
    },
    setQuantity(number) {
      self.cart = number
      self.quantity = number
      self.totalprice = self.price * number
    },
    remove() {
      destroy(self)
    },
  }))

export const PendingOrderDetails = types
  .model("PendingOrderDetails")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    cart: types.maybeNull(types.number),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
    foc: false
  })
  .actions((self) => ({
    remove() {
      destroy(self)
    },
  }))


export const FOCModel = types
  .model("FOC")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
    foc: types.boolean,
  })

export const InvoiceGroupCompany = types.model('InvoiceGroupCompany')
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

export const OrderInvoiceDetail = types
  .model("OrderInvoiceDetail")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    cart: types.maybeNull(types.number),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
    foc: types.boolean
  })


export const OrderInvoiceModel = types.model("OrderInvoice")
  .props({
    invoiceNo: types.maybeNull(types.string),
    date: types.maybeNull(types.string),
    customer: types.maybeNull(types.string),
    address: types.maybeNull(types.string),
    amount: types.maybeNull(types.string),
    newCredit: types.maybeNull(types.number),
    invoiceDetail: types.array(OrderInvoiceDetail),
    remark: types.optional(types.string, ''),
    paymentType: types.maybeNull(types.number),
    groupCompany: types.maybeNull(InvoiceGroupCompany)
  })


export const ReturnInvoiceDetail = types
  .model("ReturnInvoiceDetail")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    cart: types.maybeNull(types.number),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
  })

export const ReturnInvoiceModel = types.model("ReturnInvoice")
  .props({
    returnNo: types.maybeNull(types.string),
    date: types.maybeNull(types.string),
    customer: types.maybeNull(types.string),
    address: types.maybeNull(types.string),
    amount: types.maybeNull(types.string),
    newCredit: types.maybeNull(types.number),
    invoiceDetail: types.array(ReturnInvoiceDetail),
    remark: types.optional(types.string, ''),
    paymentType: types.maybeNull(types.number),
    groupCompany: types.maybeNull(InvoiceGroupCompany)
  })

export const PendingInvoiceDetailModel = types
  .model("PendingInvoiceDetail")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    cart: types.maybeNull(types.number),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
    foc: false
  })

export const PendingOrderModel = types.model('PendingOrder')
  .props({
    date: types.maybeNull(types.string),
    customerId: types.maybeNull(types.number),
    customerName: types.maybeNull(types.string),
    invoiceId: types.maybeNull(types.number),
    invoiceNo: types.maybeNull(types.string),
    paymentType: types.maybeNull(types.number),
    remark: types.maybeNull(types.string),
    invoiceDetail: types.array(PendingOrderDetails),
  })
  .actions((self) => ({
    remove() {
      destroy(self)
    }
  }))

export const ReturnCartModel = types
  .model("OrderCart")
  .props({
    product_id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    cart: types.maybeNull(types.number),
    quantity: types.maybeNull(types.number),
    price: types.maybeNull(types.number),
    totalprice: types.maybeNull(types.number),
  })
  .views((self) => ({
    get productPrice() {
      return (self.price * self.cart).toFixed(2)
    },
  }))
  .actions((self) => ({
    increaseQuantity(number) {
      self.cart += number
      self.quantity += number
    },
    setQuantity(number) {
      self.cart = number
      self.quantity = number
      self.totalprice = self.price * number
    },
    remove() {
      destroy(self)
    },
  }))

export interface FOCSnapshotIn extends SnapshotIn<typeof FOCModel> {
}

export interface TaskInvoiceModelSnapshotIn extends SnapshotIn<typeof OrderInvoiceModel> {
}


