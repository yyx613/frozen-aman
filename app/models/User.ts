import { Instance, types } from "mobx-state-tree"

export const UserModel = types
  .model('User')
  .props({
    employeeid: types.identifier,
    id: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    status: types.maybeNull(types.number),
    invoice_runningnumber: types.maybeNull(types.string)
  })

export interface User extends Instance<typeof UserModel> { }
