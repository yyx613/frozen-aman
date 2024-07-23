import { IconTypes } from "app/components"

export type ProductDetailsProps = {
  product_id: number
  name: string
  price: number
  quantity: number
  cart?: number
}

export type DriverProps = {
  name: string
  id: string
}
export type CustomerProps = {
  name: string
  id: string
  address: string
  phone: string
}

export type PaymentMethodProps = {
  id: string
  icon: IconTypes
  methodName: string
}

export const PRODUCT_LIST = [
  {
    id: "1",
    name: "Ice A",
    price: 2.0,
    stock: 100,
  },
  {
    id: "2",
    name: "Ice B",
    price: 4.0,
    stock: 80,
  },
  {
    id: "3",
    name: "Ice C",
    price: 4.0,
    stock: 80,
  },
  {
    id: "4",
    name: "Ice D",
    price: 4.0,
    stock: 80,
  },
]

export const DRIVER_LIST: DriverProps[] = [
  { id: "1", name: "Driver A" },
  { id: "2", name: "Driver B" },
  { id: "3", name: "Driver C" },
  { id: "4", name: "Driver D" },
  { id: "5", name: "Driver E" },
  { id: "6", name: "Driver F" },
]

export const CUSTOMER_LIST: CustomerProps[] = [
  { id: "1", name: "Customer A", address: "Bangi", phone: "0123456733" },
  { id: "2", name: "Customer B", address: "Klang", phone: "0123456733" },
  { id: "3", name: "Customer C", address: "Sekinchan", phone: "0123456733" },
  { id: "4", name: "Customer D", address: "KL", phone: "0123456733" },
  { id: "5", name: "Customer E", address: "Damansara", phone: "0123456733" },
  { id: "6", name: "Customer F", address: "Melaka", phone: "0123456733" },
  { id: "7", name: "Customer G", address: "Melaka", phone: "0123456733" },
]

export const DELIVER_STATUS = {
  PENDING: "Pending",
  COMPLETE: "Complete",
  IDLE: "Idle",
}

export const CREDIT_NOTE_LIST = [
  {
    id: "1",
    name: "Company A",
    credit: "101",
    address: "Bangi",
    phone: "0123456733",
    paymentTerm: "23 Jun 2023",
  },
  {
    id: "2",
    name: "Company B",
    credit: "100",
    paymentTerm: "22 Jun 2023",
    address: "Bangi",
    phone: "0123456733",
  },
  {
    id: "3",
    name: "Company C",
    credit: "0",
    paymentTerm: "24 Jun 2023",
    address: "Klang",
    phone: "0123456733",
  },
  {
    id: "4",
    name: "Company D",
    credit: "200",
    paymentTerm: "25 Jun 2023",
    address: "Klang",
    phone: "0123456733",
  },
]

export const INVOICE_LIST = {
  data: [
    {
      date: "2023-06-23 12:00:00",
      id: "#1",
      previousCredit: "50",
      updatedCredit: "100",
      customer: "Customer A",
      address: "Bangi Selangor",
      issueOn: "2023-06-23 12:00:00",
      paidAmount: "100",
      paymentType: "cash",
      products: [
        { name: "Ice A", quantity: "50", price: "100" },
        { name: "Ice B", quantity: "50", price: "100" },
      ],
      total: "200",
    },
    {
      date: "2023-06-23 12:00:00",
      id: "#2",
      paidAmount: "200",
      paymentType: "payment",
    },
    {
      date: "2023-06-24 12:00:00",
      id: "#3",
      previousCredit: "50",
      updatedCredit: "90",
      customer: "Customer A",
      address: "Bangi Selangor",
      paymentType: "Bank In",
      issueOn: "2023-06-23 12:00:00",
      paidAmount: "100",
      products: [
        { name: "Ice A", quantity: "5", price: "100" },
        { name: "Ice B", quantity: "5", price: "100" },
      ],
      total: "200",
    },
  ],
}

export const PAYMENT_METHOD: PaymentMethodProps[] = [
  {
    id: "1",
    methodName: "Cash",
    icon: "cash",
  },
  {
    id: "2",
    methodName: "Card",
    icon: "creditCard",
  },
  {
    id: "3",
    methodName: "Online Banking",
    icon: "bank",
  },
]

export const STOCK_LIST = {
  result: true,
  message: "Stock found",
  data: [
    {
      id: 1,
      quantity: 100,
      name: "ICE A",
    },
    {
      id: 2,
      quantity: 200,
      name: "ICE B",
    },
    {
      id: 3,
      quantity: 200,
      name: "ICE C",
    },
    {
      id: 4,
      quantity: 200,
      name: "ICE D",
    },
  ],
}

export const STOCK_TRANSFER_TASK = {
  response: true,
  message: "Stock Transfer found",
  data: {
    request: [
      {
        id: 1,
        date: "09-07-2023 16:11:05",
        status: 1,
        toDriver: {
          id: 1,
          name: "Ali",
        },
        product: {
          id: 1,
          name: "Ice A",
          quantity: 10,
        },
      },
      {
        id: 2,
        date: "09-07-2023 16:11:05",
        status: 2,
        toDriver: {
          id: 1,
          name: "Ali",
        },
        product: {
          id: 1,
          name: "Ice A",
          quantity: 10,
        },
      },
    ],
  },
  pending: [
    {
      id: 1,
      date: "09-07-2023 16:11:05",
      status: 1,
      fromDriver: {
        id: 1,
        name: "Ali",
      },
      product: {
        id: 1,
        name: "Ice A",
        quantity: 10,
      },
    },
  ],
}
