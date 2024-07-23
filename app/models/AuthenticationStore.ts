import { flow, Instance, SnapshotIn, types, getParent } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Alert } from "react-native"
import { UserModel } from "./User"
import { api, callCheckSession, callLogin, callLogout } from "../services/api"
import * as storage from 'app/utils/storage'
import { RootStoreModel } from "./RootStore"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    username: types.maybeNull(types.string),
    password: types.maybeNull(types.string),
    user: types.maybe(UserModel),
    colorCode: types.maybeNull(types.string)
  })
  .views((self) => ({
    get isAuthenticated() {
      return !!self.authToken
    },

    get validationError() {
      if (self.username?.length === 0 || self.password?.length === 0) {
        return "Please enter your username and password"
      }
      return ""
    },
  }))
  .actions(withSetPropAction)
  .actions((self) => {
    function setAuthToken(value?: string) {
      self.authToken = value;
    }
    function distributeAuthToken(value?: string) {
      // optionally grab the store's authToken if not passing a value
      const token = value || self.authToken;
      if (!token) return console.tron.error("No auth token provided", []);
      api.apiSauce.setHeader("session", `${token}`);
    }
    function setUsername(username) {
      self.username = username
    }

    function setPassword(password) {
      self.password = password
    }

    const login = flow(function* login() {
      const rootStore = getParent<typeof RootStoreModel>(self)

      const response = yield callLogin({ employeeId: self.username, password: self.password })

      // Return if login failed
      if (response.kind !== "ok") {
        Alert.alert("Error", response.message)
        return response
      }

      // Successful login
      self.password = ""
      self.username = ""
      self.user = response.auth.driver
      self.authToken = response.auth.driver.session
      self.colorCode = response.auth.colorcode
      rootStore.updateInvoiceRunningNumber(response.auth.driver.invoice_runningnumber)
      yield storage.saveString('session', response.auth.driver.session)
      api.apiSauce.setHeader("session", `${response.auth.driver.session}`);
      return response
    })


    const logout = flow(function* logout() {
      const rootStore = getParent<typeof RootStoreModel>(self)
      const response = yield callLogout({ session: self.authToken })

      // Return if login failed
      if (response.kind !== "ok") {
        Alert.alert("Error", response.message)
      }

      self.authToken = ""
      self.username = ""
      self.user = undefined
      getParent<typeof RootStoreModel>(self)
      api.apiSauce.setHeader("session", "");

      // clear async storage
      yield storage.remove('session')
      yield storage.clear()
      rootStore.logout()
    })

    const checkSession = flow(function* checkSession() {
      if (!self.authToken) return
      const rootStore = getParent<typeof RootStoreModel>(self)
      const response = yield callCheckSession({ session: self.authToken })

      // Return if failed
      if (response.kind !== "ok") {
        Alert.alert("Error", response.message)

        self.authToken = ""
        self.username = ""
        self.user = undefined
        api.apiSauce.setHeader("session", "");
        yield storage.remove('session')
        yield storage.clear()
        rootStore.logout()
        return false
      }
      return true

    })

    async function reset() {
      self.authToken = ""
      self.username = ""
      self.user = undefined
      api.apiSauce.setHeader("session", "");
      await storage.remove('session')
    }

    return {
      setAuthToken,
      setUsername,
      setPassword,
      login,
      logout,
      distributeAuthToken,
      checkSession,
      reset,
    }
  })

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }

export interface AuthenticationStoreSnapshot extends SnapshotIn<typeof AuthenticationStoreModel> { }

