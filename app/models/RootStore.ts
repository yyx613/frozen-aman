import { DeliveryStoreModel } from "./DeliveryStore"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { EpisodeStoreModel } from "./episode/EpisodeStore"
import { StockStoreModel } from "./stocks/StockStore"
import { ProductStore } from "./product/ProductStore" // @demo remove-current-line
import { CustomerStore } from "./customer/CustomerStore"
import { OrderStoreModel } from "./order/OrdeStore"
import { TaskTransferStore } from "./taskTransfer/TaskTransferStore"
import { DriverStoreModel } from "./driver/DriverStoreModel"
import { CreditNoteStore } from "./creditNote/CreditNoteStore"
import { DashboardStoreModel } from "./dashboard/DashboardStore"
import { TripStoreModel } from "./trip"
import { TaskStore } from "./task/TaskStore"
import { LocationStoreModel } from "./location"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
  stockStore: types.optional(StockStoreModel, {}),
  productStore: types.optional(ProductStore, {}),
  customerStore: types.optional(CustomerStore, {}),
  deliveryStore: types.optional(DeliveryStoreModel, {}),
  orderStore: types.optional(OrderStoreModel, {}),
  taskTransferStore: types.optional(TaskTransferStore, {}),
  driverStore: types.optional(DriverStoreModel, {}),
  creditNotesStore: types.optional(CreditNoteStore, {}),
  dashboardStore: types.optional(DashboardStoreModel, {}),
  tripStore: types.optional(TripStoreModel, {}),
  taskStore: types.optional(TaskStore, {}),
  locationStore: types.optional(LocationStoreModel, {}),
})
  .views((self) => ({
    getStock() {
      return self.stockStore.stocks
    },
    getPendingOrdes() {
      return self.orderStore.pendingOrders
    },
    getCurrentUser() {
      return self.authenticationStore.user
    }
  }))
  .actions((self) => ({
    updateStocks(stocks) {
      self.stockStore.stocks = stocks
    },
    updateTaskList({ id, status }) {
      const task = self.taskStore.task.find((item) => item.id === id)
      task.updateTaskStatus(status)
    },
    updateCustomerCreditByTaskId({ id, newCredit }) {
      const task = self.taskStore.task.find((item) => item.id === id)
      task.udpateNewCredit(newCredit)
    },
    updateCustomerCreditByCustomerId({ id, newCredit }) {
      const task = self.taskStore.task.find((item) => item.customer_id === id)
      task.udpateNewCredit(newCredit)
    },
    logout() {
      self.taskStore.resetTask()
      self.stockStore.resetStore()
      self.tripStore.reset()
      self.productStore.reset()
      self.customerStore.reset()
      self.dashboardStore.reset()
      self.driverStore.reset()
      self.orderStore.reset()
      self.taskTransferStore.reset()
      self.creditNotesStore.reset()
    },
    updateInvoiceRunningNumber(value) {
      self.orderStore.invoiceRunningNumber = value
    },
    async submitPendingOrders() {
      return self.orderStore.submitPendingTask()
    }
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {
}
