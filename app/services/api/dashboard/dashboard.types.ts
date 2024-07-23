export interface ApiDashboardResponse {
  result: boolean,
  message: string,
  data: {
    sales: number,
    cash: number,
    credit: number,
    productsold: {
      total_quantity: number,
      details: { name: string, quantity: number }[]
    }
  }
}
