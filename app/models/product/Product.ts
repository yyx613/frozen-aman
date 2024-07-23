import { Instance, SnapshotIn, types } from "mobx-state-tree"
export const ProductModel = types
  .model('Product')
  .props({
    id: types.maybe(types.identifierNumber),
    name: types.maybeNull(types.string),
    code: types.maybeNull(types.string),
    price: types.maybeNull(types.number),
  })
export interface Product extends Instance<typeof ProductModel> {}

export interface ProductSnapshotIn extends SnapshotIn<typeof ProductModel> {}
