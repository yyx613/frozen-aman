import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { DriverModel } from "./Driver"
import { callDriverList } from "app/services/driver"


export const DriverStoreModel = types
  .model("DriverStore")
  .props({
    drivers: types.maybeNull(types.array(DriverModel)),
    isLoading: false
  })
  .views((self) => ({
    filterDriverByName(text) {
      if (!text) return self.drivers
      return self.drivers.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
    }
  }))
  .actions(withSetPropAction)
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading
    }

    const loadDrivers = flow(function* loadDrivers() {
      markLoading(true)
      const response = yield callDriverList()
      markLoading(false)

      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching driver list: ${JSON.stringify(response)}`, [])
        return response
      }
      self.drivers = response.data
      return response
    })

    function reset() {
      self.drivers.clear()
    }

    return { loadDrivers, reset }

  })

export interface DriverStore extends Instance<typeof DriverStoreModel> {
}

export interface DriverStoreSnapshot extends SnapshotOut<typeof DriverStoreModel> {
}

