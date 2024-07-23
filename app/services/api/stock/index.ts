import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import {
  ApiGetStock,
  ApiGetStockTransaction,
  ApiGetStockTransferTask,
  ApiRequestTransfer,
  ApiUpdateTransfer,
} from "./stock.types"
import { StockSnapshotIn, StockTransactionSnapshotIn, StockTransferTaskSnapshotIn } from "app/models/stocks/Stock"

export const callStocks = async (): Promise<{
  kind: "ok";
  data?: StockSnapshotIn,
  message?: string
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiGetStock> = await api.apiSauce.get(
    `${apiEndpoint.stock}`)


  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    if (!response.data.result) return { kind: "not-found", message: response.data.message }
    const data: StockSnapshotIn = response.data.data
    return { kind: "ok", data }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callStockTransferHistory = async (): Promise<{
  kind: "ok";
  data: StockTransferTaskSnapshotIn
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiGetStockTransferTask> = await api.apiSauce.get(
    `${apiEndpoint.stock}/transfer`)


  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    if (!response.data.result) return { kind: "not-found", message: response.data.message }
    const data: StockTransferTaskSnapshotIn = response.data.data
    return { kind: "ok", data }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const updateStockTransferTask = async ({ id, status }): Promise<{
  kind: "ok";
  data
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiUpdateTransfer> = await api.apiSauce.get(
    `${apiEndpoint.stock}/transfer/update`, { transfer_id: id, status })

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const data = response.data.message
    return { kind: "ok", data }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callRequestStockTransfer = async ({ id, transferDetail }): Promise<{
  kind: "ok";
  message: string
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiRequestTransfer> = await api.apiSauce.post(
    `${apiEndpoint.stock}/transfer`, { driver_id: id, transferdetail: transferDetail })

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    return { kind: "ok",  message: response.data.message}
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callStockTransactionHistory = async (date): Promise<{
  kind: "ok";
  data: StockTransactionSnapshotIn
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiGetStockTransaction> = await api.apiSauce.post(
    `${apiEndpoint.stock}/transaction`, { date })


  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    if (!response.data.result) return { kind: "not-found", message: response.data.message }
    const data: StockTransferTaskSnapshotIn = response.data.data
    return { kind: "ok", data }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}


