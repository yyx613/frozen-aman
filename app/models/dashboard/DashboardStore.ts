import { flow, types } from "mobx-state-tree"
import { callDashboard } from "../../services/api"
import { DashboardModel } from "./Dashboard"
import { withSetPropAction } from "../helpers/withSetPropAction"
import moment from "moment"

export const DashboardStoreModel = types
  .model("DashboardStore")
  .props({
    result: types.maybe(types.boolean),
    message: types.maybe(types.string),
    dashboard: types.maybe(DashboardModel),
    isLoading: false
  })
  .views((store) => ({
    getSales: () => store.dashboard?.sales,
    getCash: () => store.dashboard?.cash,
    getCredit: () => store.dashboard?.credit,
    getTotalProductSold: () => store.dashboard?.productsold.total_quantity,
    getProductSoldDetails: () => store.dashboard?.productsold.details
  }))
  .actions(withSetPropAction)
  .actions((self) => {

    function markLoading(loading) {
      self.isLoading = loading
    }

    const fetchDashboard = flow(function* fetchDashboard(date) {
      markLoading(true)
      const formattedDate = moment(date).format('YYYY-MM-DD')
      const response = yield callDashboard({ date: formattedDate })

      if (response.kind !== "ok") {
        console.tron.error(`Error fetching dashboard: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return response
      }
      markLoading(false)
      self.setProp('dashboard', response.dashboard);
      return response
    })

    function reset() {
      self.result = false
      self.message = ''
      self.dashboard = undefined
      self.isLoading = false
    }

    return {
      fetchDashboard,
      reset
    }
  })
