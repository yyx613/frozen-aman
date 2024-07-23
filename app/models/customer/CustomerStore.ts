import { types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { CUSTOMER_LIST } from "app/constants"
import { CustomerModel } from "./Customer"

export const CustomerStore = types
    .model('CustomerStore')
    .props({
      customers: types.array(CustomerModel),
      isLoading: types.optional(types.boolean, false),
    })
  .views((self)=>({
    filterCustomerByName(text){
      if(!text) return self.customers
      return self.customers.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
    },
  }))
    .actions(withSetPropAction)
    .actions((self) => ({
        loadCustomers() {
          self.setProp('customers', CUSTOMER_LIST)
        },
      reset(){
        self.customers.clear()
        self.isLoading= true
      }
    }))
