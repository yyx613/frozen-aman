import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { CreditCustomerSnapshotIn, CustomerDetailModelSnapshotIn, InvoiceSnapshotIn } from "app/models"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import {
  ApiCustomerHistory,
  ApiGetCustomerResponse,
  ApiInvoiceDetails,
  ApiMakeCreditNotePayment,
} from "./creditNote.type"

export const callCustomer = async (): Promise<{
  kind: "ok";
  customer: CreditCustomerSnapshotIn
} | GeneralApiProblem> => {

  const response: ApiResponse<ApiGetCustomerResponse> = await api.apiSauce.get(
    `${apiEndpoint.customer}`)


  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const customer: CreditCustomerSnapshotIn = response.data.data
    return { kind: "ok", customer }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callCustomerHistory = async ({ customerId }): Promise<{
  kind: "ok";
  customerHistory: CustomerDetailModelSnapshotIn
} | GeneralApiProblem> => {

  const response: ApiResponse<ApiCustomerHistory> = await api.apiSauce.post(
    `${apiEndpoint.customer}/detail`, { customer_id:customerId })

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const customerHistory: CustomerDetailModelSnapshotIn = response.data.data
    return { kind: "ok", customerHistory }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callInvoiceDetails = async ({ customerId, invoiceId }): Promise<{
  kind: "ok";
  data: InvoiceSnapshotIn
} | GeneralApiProblem> => {

  const response: ApiResponse<ApiInvoiceDetails> = await api.apiSauce.post(
    `${apiEndpoint.customer}/invoice`, { customer_id:customerId, invoice_id: invoiceId })

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const data: InvoiceSnapshotIn = response.data.data
    return { kind: "ok", data }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const makeCreditNotePayment = async ({ customerId, amount }): Promise<{
  kind: "ok";
  data,
  message: string
} | GeneralApiProblem> => {

  const response: ApiResponse<ApiMakeCreditNotePayment> = await api.apiSauce.post(
    `${apiEndpoint.customer}/makepayment`, { customer_id:customerId, amount })

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const data = response.data.data
    return { kind: "ok", data , message: response.data.message}
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}
