import Moment from "moment"
import { callUpdateLocation } from "app/services/api"
import { flow, types } from "mobx-state-tree"

export const LocationStoreModel = types
    .model("LocationStore")
    .props({
        latitude: types.maybeNull(types.number),
        longitude: types.maybeNull(types.number),
    })
    .actions((self) => {

        const updateLocation = flow(function* updateLocation(coords) {
            const { longitude, latitude } = coords || {}
            const date = Moment().format('YYYY-MM-DD hh:mm:ss')
            const response = yield callUpdateLocation({ date, longitude, latitude })

            // Return if login failed
            if (response.kind !== "ok") {
                console.log('Error', response.message)
                return response
            }

            // Successful login
            return response
        })

        function reset(){
            self.latitude= 0
            self.longitude= 0
        }

        return {
            updateLocation,
            reset
        }
    })


