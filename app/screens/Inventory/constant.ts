

export const INVENTORY_LOGS = [
    { date: '01 Jun 2023', data: [{ product: 'Ice A', quantity: '+ 10' }, { product: 'Ice B', quantity: '+ 10' }] },
    { date: '02 Jun 2023', data: [{ product: 'Ice A', quantity: '+ 10' }, { product: 'Ice B', quantity: '+ 10' }] },
]

const STATUS = {
    1: 'Pending',
    2: 'Accepted',
    3: 'Rejected'
}

const ACTION = {
    PENDING: 1,
    APPROVE: 2,
    REJECT: 3,
}

const TASK_TYPE = {
    TO_DRIVER: 'toDriver',
    FROM_DRIVER: 'fromDriver'
}

export const TRANSACTION_TYPE = {
    0: 'Opening',
    1: 'Stock In',
    2: 'Stock Out',
    3: 'Invoice',
    4: 'Transfer',
    5: 'Wastage'
}


export const STOCK_TRANSFER = {
    STATUS,
    TASK_TYPE,
    ACTION
}
