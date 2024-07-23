import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const CreditNoteGroupCompany = types.model('CreditNoteGroupCompany')
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

export const CreditCustomerModel = types.model("Customer", {
  id: types.identifierNumber,
  code: types.maybeNull(types.string),
  company: types.maybeNull(types.string),
  credit: types.maybeNull(types.number),
  paymentterm: types.maybeNull(types.number),
  address: types.maybeNull(types.string),
  phone: types.maybeNull(types.string),
  groupcompany: types.maybeNull(CreditNoteGroupCompany)
}).actions((self) => ({
  updateCredit(credit) {
    self.credit = credit
  }
}))


export const CreditHistoryModel = types.model('CreditHistory', {
  id: types.identifierNumber,
  date: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  amount: types.maybeNull(types.number),
  type: types.maybeNull(types.string),
})

export const CustomerHistoryModel = types.model('CreditHistory', {
  customerdetail: types.optional(types.array(CreditHistoryModel), [])
})

const ProductModel = types.model('InvoiceProduct').props({
  name: types.maybeNull(types.string)
})

export const InvoiceDetailsModel = types.model('InvoiceDetails', {
  product_id: types.identifierNumber,
  quantity: types.maybeNull(types.number),
  price: types.maybeNull(types.number),
  totalprice: types.maybeNull(types.number),
  product: types.maybe(ProductModel)
})

const InvoicePaymentModel = types.model('InvoicePayment', {
  type: types.number,
  amount: types.number
})

const InvoiceDriverModel = types.model('InvoiceDriver', {
  name: types.string,
})

export const InvoiceModel = types.model('Invoice', {
  id: types.identifierNumber,
  invoiceno: types.maybeNull(types.string),
  date: types.maybeNull(types.string),
  customer_id: types.maybeNull(types.number),
  status: types.maybeNull(types.number),
  newcredit: types.maybeNull(types.number),
  invoicedetail: types.maybeNull(types.array(InvoiceDetailsModel)),
  customer: types.maybe(CreditCustomerModel),
  invoicepayment: types.maybeNull(types.array(InvoicePaymentModel)),
  driver: types.maybeNull(InvoiceDriverModel)
})

export interface Customer extends Instance<typeof CreditCustomerModel> { }

export interface CreditCustomerSnapshotIn extends SnapshotIn<typeof CreditCustomerModel> { }
export interface CustomerDetailModelSnapshotIn extends SnapshotIn<typeof CustomerHistoryModel> { }
export interface InvoiceSnapshotIn extends SnapshotIn<typeof InvoiceModel> { }

