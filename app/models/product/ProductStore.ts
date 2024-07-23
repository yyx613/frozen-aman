import { flow, types } from "mobx-state-tree"
import { values } from "mobx"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ProductModel } from "./Product"
import { callProduct } from "../../services/api"

export const ProductStore = types
  .model('ProductStore', {
    isLoading: true,
    products: types.array(ProductModel)
  })
  .views((self) => ({
    get sortProductByName() {
      return sortProducts(values(self.products))
    },
    getProductById(id) {
      return self.products.find(((item) => item.id === id))
    }
  }))
  .actions(withSetPropAction)
  .actions((self) => {

    function markLoading(loading) {
      self.isLoading = loading
    }


    const loadProducts = flow(function* loadProducts() {
      const response = yield callProduct()
      if (response.kind !== 'ok') {
        console.tron.error(`Error fetching product list: ${JSON.stringify(response)}`, [])
        return response
      }
      self.products = response.data
      return response
    })


    function reset() {
      self.isLoading = false
      self.products.clear()
    }

    return {
      markLoading,
      loadProducts,
      reset
    }
  })

function sortProducts(products) {
  return products
    .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1))
}
