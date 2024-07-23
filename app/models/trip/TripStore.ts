import { flow, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { callCheckTrip, callEndTrip, callGetKelindan, callGetLorry, callStartTrip } from "../../services/api/trip"
import { KelindanModel, LorryModel, TripModel, WastageModel } from "./Trip"
import { Alert } from "react-native"

export const TripStoreModel = types
  .model("TripStore")
  .props({
    trip: types.maybe(TripModel),
    selectedKelindan: types.maybeNull(types.late(() => types.reference(KelindanModel))),
    kelindan: types.maybeNull(types.array(KelindanModel)),
    lorry: types.maybeNull(types.array(LorryModel)),
    selectedLorry: types.maybeNull(types.late(() => types.reference(LorryModel))),
    wastage: types.array(WastageModel),
    status: false,
    isLoading: false,
  })
  .views((self) => ({
    getTrip: () => self.trip,
    filterLorryByName(text) {
      if (!text) return self.lorry
      return self.lorry.filter((item) => item.lorryno.toLowerCase().includes(text.toLowerCase()))
    },
    filterKelindanByName(text) {
      if (!text) return self.kelindan
      return self.kelindan.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
    },
    getTotalWastage() {
      return self.wastage.reduce((total, product) => total + product.cart, 0)
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => {
    function markLoading(loading) {
      self.isLoading = loading
    }

    function updateWastageCart(selectedProduct) {
      const { name, cart } = selectedProduct
      let product = self.wastage.find((item) => item.name === name)
      if (!product) {
        self.wastage.push(selectedProduct)
        product = self.wastage[self.wastage.length - 1]
      }
      product.setQuantity(cart)
      if (cart === 0) product.remove()
    }

    const checkTrip = flow(function* checkTrip() {
      markLoading(true)
      const response = yield callCheckTrip()
      if (response.kind !== 'ok') {
        console.tron.error(`Error check trip: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return response
      }
      self.status = response.data.status
      self.trip = response.data.trip
      markLoading(false)
      return response
    })

    function updateSelectedKelindan(kelindan) {
      self.selectedKelindan = kelindan
    }

    function updateSelectedLorry(lorry) {
      self.selectedLorry = lorry
    }

    const loadKelindan = flow(function* loadKelindan() {
      markLoading(true)
      const response = yield callGetKelindan()
      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching kelindan list: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return response
      }
      self.kelindan = response.data
      markLoading(false)
      return response
    })

    const loadLorry = flow(function* loadLorry() {
      markLoading(true)
      const response = yield callGetLorry()
      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching kelindan list: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return response
      }
      self.lorry = response.data
      markLoading(false)
      return response
    })

    const startTrip = flow(function* startTrip() {
      markLoading(true)
      const response = yield callStartTrip({ kelindan_id: self.selectedKelindan.id, lorry_id: self.selectedLorry.id })
      if (response.kind !== 'ok') {
        console.tron.error(`Error start trip: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return Alert.alert(response.message)
      }
      self.status = true
      self.trip = response.data

      // self.trip= {
      //   created_at: '', date: '', driver_id: undefined, id: undefined, types: undefined,
      //   kelindan_id: self.selectedKelindan.id,
      //   lorry_id: self.selectedLorry.id,
      //   colorcode: undefined
      // }

      markLoading(false)
      return response
    })

    const endTrip = flow(function* endTrip({ cash }) {
      markLoading(true)
      const response = yield callEndTrip({
        kelindan_id: self.trip.kelindan_id,
        lorry_id: self.trip.lorry_id,
        wastage: formatWastageCart(self.wastage),
        cash
      })
      if (response.kind !== 'ok') {
        console.tron.error(`Error start trip: ${JSON.stringify(response)}`, [])
        markLoading(false)
        return Alert.alert(response.message)
      }
      Alert.alert(response.message)
      markLoading(false)
      return response
    })

    function resetTrip() {
      self.selectedKelindan = undefined
      self.status = false
      self.selectedLorry = undefined
      self.wastage.clear()
    }

    function resetTripInputInfo() {
      self.selectedKelindan = undefined
      self.selectedLorry = undefined
    }

    function reset() {
      self.trip = undefined
      self.selectedKelindan = undefined
      self.selectedLorry = undefined
      self.kelindan?.clear()
      self.lorry?.clear()
      self.wastage.clear()
      self.status = false
      self.isLoading = false
    }

    return {
      checkTrip,
      updateSelectedKelindan,
      updateSelectedLorry,
      loadKelindan,
      loadLorry,
      startTrip,
      endTrip,
      updateWastageCart,
      resetTrip,
      reset,
      resetTripInputInfo,
    }
  })

function formatWastageCart(cart) {
  return cart.map((item) => ({
    product_id: item.product_id,
    quantity: item.cart
  }))
}
