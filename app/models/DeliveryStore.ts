import { Instance, types } from "mobx-state-tree"
import { CUSTOMER_LIST, DELIVER_STATUS } from "app/constants"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CustomerModel } from "./customer"


const DeliveryStatusProps = types
  .model("DeliveryStatus")
  .props({
    id: types.identifier,
    customerName: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
  }).actions((self) => ({
    setStatus(status) {
      self.status = status
    },
  }))

export const DeliveryStoreModel = types
  .model("Delivery")
  .props({
    deliveryRoute: types.array(CustomerModel),
    isDelivering: types.maybe(types.boolean),
    deliveryStatus: types.map(DeliveryStatusProps),
  })
  .views((self) => ({
    getCustomerDeliveryStatus(id) {
      if (!self.deliveryStatus.get(id)) return null
      return self.deliveryStatus.get(id).status
    },
    getDeliveryProgress() {
      const deliveryStatusList = [...self.deliveryStatus.values()]
      const totalComplete = deliveryStatusList
        .reduce((total, order) => (order.status === DELIVER_STATUS.COMPLETE ? total + 1 : total), 0)
      return totalComplete / deliveryStatusList.length
    },
    getSelectedCustomer(id) {
      return self.deliveryRoute.find(item => item.id === id)
    },
    getFilterTaskList(text) {
      return self.deliveryRoute.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))

    }
  }))
  .actions(withSetPropAction)
  .actions((self) => {
    function loadDeliveryRoute() {
      self.setProp("deliveryRoute", CUSTOMER_LIST)
    }

    function updateDeliveryRoute(list) {
      self.deliveryRoute = list
      console.log("deliverRoute", self.deliveryRoute.toJSON())
    }

    function initDeliveryStatus(json) {
      json.forEach((item) => {
        self.deliveryStatus.put({
          id: item.id,
          customerName: item.name,
          status: DELIVER_STATUS.PENDING,
        })
      })
    }

    function startTrip() {
      self.isDelivering = true
      initDeliveryStatus(self.deliveryRoute)
    }

    function endTrip() {
      self.isDelivering = false
    }

    function updateDeliveryStatus(id, status) {
      const order = [...self.deliveryStatus.values()].find((item) => item.id === id)
      if (order) {
        order.setStatus(status)
      }
    }

    function udpateDriverInfo(lorry, kelindan) {
      //call api
    }

    return {
      loadDeliveryRoute,
      updateDeliveryRoute,
      startTrip,
      endTrip,
      updateDeliveryStatus,
      udpateDriverInfo
    }
  })

export interface DeliveryStore extends Instance<typeof DeliveryStoreModel> {
}
