import React, { useEffect } from "react"
import { getGeoLocationPermission, getLocationCoordinates } from "./geolocation"
import { useStores } from "../models"
import useAppState from "./useAppState"


export const useGetGeolocation=()=>{
  const {locationStore, authenticationStore } = useStores()
  const appState = useAppState()

  useEffect(()=>{
    if(appState && checkValidSession()){
      getPosition().then()
    }
  }, [appState])

  const checkValidSession =async ()=>{
   return await authenticationStore.checkSession()
  }

  const getPosition = async () => {
    await getGeoLocationPermission()
    const coords = await getLocationCoordinates()
    await locationStore.updateLocation(coords?.response?.coords)
  }
}
