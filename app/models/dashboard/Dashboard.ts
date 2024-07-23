import { Instance, SnapshotIn, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

const EndTripInfo = types.model('EndTripInfo')
  .props({
    id: types.identifierNumber,
    driver_name: types.maybeNull(types.string),
    kelindan_name: types.maybeNull(types.string),
    lorryno: types.maybeNull(types.string)
  })
const ProductSoldDetail = types.model('ProductSoldDetials')
  .props({
    name: types.maybeNull(types.string),
    quantity: types.maybeNull(types.string)
  })
export const ProductSoldModel = types.
  model('ProductSold')
  .props({
    total_quantity: types.maybeNull(types.number),
    details: types.array(ProductSoldDetail)
  })
export const DashboardModel = types
  .model("Dashboard")
  .props({
    sales: types.maybeNull(types.number),
    cash: types.maybeNull(types.number),
    credit: types.maybeNull(types.number),
    productsold: types.maybeNull(ProductSoldModel),
    trip: types.maybeNull(types.array(EndTripInfo))
  })
  .actions(withSetPropAction)


export interface Dashboard extends Instance<typeof DashboardModel> { }

export interface DashboardSnapshotIn extends SnapshotIn<typeof DashboardModel> { }
