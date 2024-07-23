export interface ApiLoginResponse {
  result: boolean,
  message: string,
  data: {
    id: number,
    employeeid: string,
    name: string,
    ic: string,
    phone: string,
    commissionrate: number,
    bankdetails1: string,
    bankdetails2: string,
    firstvaccine: string,
    secondvaccine: string,
    temperature: null,
    status: number,
    remark: string,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    session: string,
    invoice_runningnumber: string
    colorcode: string
  },
}

export interface ApiLogoutResponse {
  result: boolean,
  message: string,
  data: any
}

export interface ApiCheckSession {
  result: boolean,
  message: string,
  data: {
    session: string
  }
}