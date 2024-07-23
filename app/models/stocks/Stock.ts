import { destroy, Instance, SnapshotIn, types } from "mobx-state-tree"

export const StockModel = types
    .model("Stock")
    .props({
        product_id: types.identifierNumber,
        name: types.maybeNull(types.string),
        quantity: types.maybeNull(types.number),
    })

export const ProductModel = types
    .model("Stock")
    .props({
        id: types.identifierNumber,
        name: types.maybeNull(types.string),
    })


export const StockDriverModel = types
    .model('StockDriver')
    .props({
        id: types.identifierNumber,
        name: types.maybeNull(types.string)
    })


export const StockTransferRequestTaskModel = types
    .model("StockTrasnferRequestTask")
    .props({
        id: types.identifierNumber,
        date: types.maybeNull(types.string),
        status: types.maybeNull(types.number),
        quantity: types.maybeNull(types.number),
        todriver: StockDriverModel,
        product: ProductModel
    })

export const StockTransferPendingTaskModel = types
    .model("StockTrasnferPendingTask")
    .props({
        id: types.identifierNumber,
        date: types.maybeNull(types.string),
        status: types.maybeNull(types.number),
        quantity: types.maybeNull(types.number),
        fromdriver: StockDriverModel,
        product: ProductModel
    })


export const StockTransferTaskModel = types
    .model('StockTansferTask')
    .props({
        request: types.maybe(types.array(StockTransferRequestTaskModel)),
        pending: types.maybe(types.array(StockTransferPendingTaskModel))
    })

export const CartEntry = types
    .model("CartEntry")
    .props({
        product_id: types.identifierNumber,
        name: types.maybeNull(types.string),
        cart: types.maybeNull(types.number),
        price: types.maybeNull(types.number)
    })
    .actions((self) => ({
        increaseQuantity(number) {
            self.cart += number
        },
        setQuantity(number) {
            self.cart = number
        },
        remove() {
            destroy(self)
        },
    }))

export const StockTransactionsModel = types.model('StockTransaction')
    .props({
        id: types.identifierNumber,
        quantity: types.maybeNull(types.number),
        type: types.maybeNull(types.number),
        date: types.maybeNull(types.string),
        name: types.maybeNull(types.string)
    })

export interface Stock extends Instance<typeof StockModel> { }

export interface StockSnapshotIn extends SnapshotIn<typeof StockModel> { }
export interface StockTransferTaskSnapshotIn extends SnapshotIn<typeof StockTransferTaskModel> { }
export interface StockTransactionSnapshotIn extends SnapshotIn<typeof StockTransactionsModel> { }
