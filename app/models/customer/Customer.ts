import { types } from "mobx-state-tree"

export const CustomerModel = types
  .model('Customer')
  .props({
    id: types.identifier,
    name: types.maybeNull(types.string),
    address: types.maybeNull(types.string),
    phone: types.maybeNull(types.string),
  })
