import { flow, types } from "mobx-state-tree"
import { TASK_TRANSFERED_LIST } from "../screens/TaskTransfer/constant"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CustomerModel } from "./customer"
import { DriverModel } from "./driver"

export const Task = types
  .model("Task")
  .props({
    id: types.identifier,
    customer: types.maybeNull(types.string),
    driver: types.maybeNull(types.string)
  })

export const TaskTransferStore = types
  .model("TaskTransferStore")
  .props({
    taskTransferredList: types.array(Task),
    selectedDriver: types.maybeNull(types.reference(DriverModel)),
    selectedCustomersList: types.array(types.reference(CustomerModel)),
    isLoading: true,
  })
  .views((self) => ({
    selectedCustomer(id) {
      return !!self.selectedCustomersList.find(item => item.id === id)
    }
  }))
  .actions(withSetPropAction)
  .actions((self) => {

    function markLoading(loading) {
      self.isLoading = loading
    }

    const loadTaskTransferredList = flow(function* loadTaskTransferredList() {
      try {
        // call api to get products
        self.setProp("taskTransferredList", TASK_TRANSFERED_LIST)
        markLoading(false)
      } catch (err) {
        console.error("Failed to load task transfer list ", err)
      }
    })

    function updateSelectedDriver(driver: any) {
      self.selectedDriver = driver
    }

    function updateSelectedCustomer(customer) {
      const foundCustomer = self.selectedCustomersList.find(item => item.id === customer.id)
      if (foundCustomer) {
        self.selectedCustomersList.remove(customer)
        return
      }
      self.selectedCustomersList.push(customer)
    }

    function submitTaskTransfer() {
      // call submit task transfer api
      self.selectedDriver = null
      self.selectedCustomersList.clear()
    }
    return {
      loadTaskTransferredList,
      updateSelectedDriver,
      updateSelectedCustomer,
      submitTaskTransfer
    }
  })

