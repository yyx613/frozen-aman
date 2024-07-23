import { Instance, SnapshotIn, types, destroy } from "mobx-state-tree"

export const KelindanModel = types
  .model("Kelindan")
  .props({
    id: types.identifierNumber,
    name: types.string,
  })

export const LorryModel = types
  .model("Lorry")
  .props({
    id: types.maybeNull(types.identifierNumber),
    lorryno: types.maybeNull(types.string),
  })

export const TripModel = types
  .model("Trip")
  .props({
    id: types.maybeNull(types.number),
    date: types.maybeNull(types.string),
    driver_id: types.maybeNull(types.number),
    kelindan_id: types.maybeNull(types.number),
    lorry_id: types.maybeNull(types.number),
    types: types.maybeNull(types.number),
    created_at: types.maybeNull(types.string),
    colorcode: types.maybeNull(types.string)
  })


export const TripOverviewModel = types
  .model("TripOverview")
  .props({
    status: types.maybeNull(types.boolean),
    trip: types.maybeNull(TripModel)
  })

export const WastageModel = types
  .model('Wastage')
  .props({
    product_id: types.identifierNumber,
    name: types.string,
    cart: types.number,
  })
  .actions((self) => ({
    setQuantity(number) {
      self.cart = number
    },
    remove() {
      destroy(self)
    },
  }))

export interface Trip extends Instance<typeof TripModel> { }
export interface TripSnapshotIn extends SnapshotIn<typeof TripOverviewModel> { }
export interface KelindanSnapshotIn extends SnapshotIn<typeof KelindanModel> { }
export interface LorrySnapshotIn extends SnapshotIn<typeof LorryModel> { }
