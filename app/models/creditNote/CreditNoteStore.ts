import { flow, getParent, types } from "mobx-state-tree"
import Moment from "moment"
import { callCustomer, callCustomerHistory, callInvoiceDetails, makeCreditNotePayment } from "app/services/api"
import { CreditCustomerModel, CustomerHistoryModel, InvoiceModel } from "./CreditNote"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { RootStoreModel } from "../RootStore"
import { dateTime } from "../../utils"


export const CreditNoteStore = types
  .model("Notes", {
    isLoading: true,
    customers: types.map(CreditCustomerModel),
    history: types.maybe(CustomerHistoryModel),
    invoice: types.maybe(InvoiceModel),
  })
  .views((self) => ({
    getSelectedCustomerDetails(id) {
      return self.customers.get(id)
    },
    getHistory() {
      if (!self.history?.customerdetail) {
        return []
      }
      const transactionList = self.history.customerdetail
      return transactionList
        .reduce((result, item) => {
          const itemDate = Moment(item.date, dateTime.BACK_END_TIME).format('DD MMM YYYY'); // Extract the date portion

          let section = result.find((section) => section.date === itemDate);
          if (!section) {
            section = {
              date: itemDate,
              data: []
            };
            result.push(section);
          }

          section.data.push(item);
          return result;
        }, []);
    },
    geInvoiceTotal() {
      if (!self.invoice?.invoicedetail) {
        return null
      }
      return self.invoice.invoicedetail.reduce(
        (total, product) => total + product.totalprice,
        0,
      ).toFixed(2)
    },
    filterCustomerByName(text) {
      const customerList = [...self.customers.values()]
      if (!text) return customerList
      return customerList.filter((item) => item.company.toLowerCase().includes(text.toLowerCase()))
    },
    getTotalCreditNote() {
      const customerList = [...self.customers.values()]
      return customerList.reduce((total, i) => total + i.credit, 0)
    }
  }))
  .actions(withSetPropAction)
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading
    }
    function updateCustomers(json) {
      if (!json) return
      json.forEach((customerJson) => {
        self.customers.put(customerJson)
      })
    }

    const loadCustomers = flow(function* loadCustomers() {
      markLoading(true);
      const response = yield callCustomer()
      markLoading(false);
      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching customer list: ${JSON.stringify(response)}`, [])
        return response
      }
      self.customers = undefined
      updateCustomers(response.customer)
      return response
    })

    const loadHistory = flow(function* loadHistoy(customerId) {
      markLoading(true)
      const response = yield callCustomerHistory({ customerId })
      markLoading(false)

      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching customer list: ${JSON.stringify(response)}`, [])
        return
      }
      console.tron.log(response.customerHistory)
      self.history = response.customerHistory
    })

    const loadInvoiceDetails = flow(function* loadInvoiceDetails({ customerId, invoiceId }) {
      markLoading(true)
      const response = yield callInvoiceDetails({ customerId, invoiceId })
      markLoading(false)

      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching invoice details: ${JSON.stringify(response)}`, [])
        return
      }
      console.tron.log(response.data)
      self.invoice = response.data
    })

    const payCreditNote = flow(function* payCreditNote({ customerId, amount }) {
      markLoading(true)
      const response = yield makeCreditNotePayment({ customerId, amount })
      markLoading(false)

      if (response.kind !== 'ok') {
        console.tron.error(`Error pay credit note: ${JSON.stringify(response)}`, [])
        return response
      }
      const customer = self.customers.get(customerId)
      customer.updateCredit(response.data.newcredit)
      getParent<typeof RootStoreModel>(self).updateCustomerCreditByCustomerId({ id: customerId, newCredit: response.data.newcredit })
      return response
    })

    function reset() {
      self.isLoading = true
      self.customers = undefined
      self.history = undefined
      self.invoice = undefined
    }

    return {
      loadCustomers,
      loadHistory,
      loadInvoiceDetails,
      payCreditNote,
      reset
    }

  })
