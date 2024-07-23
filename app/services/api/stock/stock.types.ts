export interface ApiGetStock {
    result: boolean,
    message: string,
    data: [
        {
            id: number,
            product_id: number,
            quantity: number,
            name: string,

        }
    ]
}

export interface ApiGetStockTransferDriver {
    result: true,
    message: string,
    data: [
        {
            driver_id: number,
            name: string,
            employeeid: string
        }
    ]
}

export interface ApiRequestTransfer {
    result: boolean,
    message: string,
}

export interface ApiGetStockTransferTask {
    result: boolean,
    message: string,
    data: {
        request: [
            {
                id: number,
                date: string,
                status: number,
                toDriver: {
                    id: number,
                    name: string
                },
                product: {
                    id: number,
                    name: string,
                    quantity: number
                }
            }
        ],
        pending: [
            {
                id: number,
                date: string,
                status: number,
                fromDriver: {
                    id: number,
                    name: string
                },
                product: {
                    id: number,
                    name: string,
                    quantity: number
                }
            }
        ]
    }
}

export interface ApiUpdateTransfer {
    result: boolean,
    message: string,
}

export interface ApiGetStockTransfer {
    result: boolean,
    message: string,
    data: [
        {
            id: number,
            name: string,
            quantity: number,
            date: string
        }
    ]
}

export interface ApiGetStockTransaction {
    result: boolean,
    message: string,
    data: [
        {
            id: number,
            quantity: number,
            type: number,
            date: string,
            name: string
        }
    ]
}