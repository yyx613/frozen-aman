import { IconTypes } from "../../components"

export type ProductDetailsProps = {
  name: string,
  price: number,
  quantity: number,
  cart?: number
  product_id: number
}

export type PaymentMethodProps = {
  id: string,
  value: number,
  icon: IconTypes,
  methodName: string,
}

export const PRODUCT_LIST: ProductDetailsProps[] = [
  {
    name: 'Ice A',
    price: 2.00,
    stock: 100
  },
  {
    name: 'Ice B',
    price: 4.00,
    stock: 80
  },
  {
    name: 'Ice C',
    price: 4.00,
    stock: 80
  },
  {
    name: 'Ice D',
    price: 4.00,
    stock: 80
  },
]


export const PAYMENT_METHOD: PaymentMethodProps[] = [
  {
    id: '1',
    value: 1,
    methodName: 'Cash',
    icon: 'cash'
  },
  {
    id: '2',
    value: 2,
    methodName: 'Credit',
    icon: 'creditNote'
  },
  {
    id: '3',
    value: 3,
    methodName: 'BankIn',
    icon: 'bank'
  },
  {
    id: '4',
    value: 4,
    methodName: 'TNG',
    icon: 'tng'
  }
]

const TASK_STATUS = {
  0: 'Pending',
  8: 'Completed',
  9: 'Canceled'
}

const COMPLETED_STATUS = 8
export const PAY_BY_CREDIT = 2




export const DELIVERY = {
  TASK_STATUS,
  COMPLETED_STATUS
}