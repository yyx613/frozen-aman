export interface ApiReturnStockProps {
  date: string,
  customerId: number,
  remark?: string,
  returnId?: number,
  returnNo?: string,
  paymentType: number,
  returnDetail: {
    product_id: number,
    quantity: number,
    price: number,
  }[]
}

