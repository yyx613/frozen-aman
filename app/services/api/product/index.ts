import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import { APIGetProductType } from "./product.types"
import { ProductSnapshotIn } from "../../../models/product/Product"

export const callProduct = async (): Promise<{
  kind: "ok";
  data: ProductSnapshotIn
} | GeneralApiProblem> => {
  const response: ApiResponse<APIGetProductType> = await api.apiSauce.post(
    `${apiEndpoint.product}`)


  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const data: ProductSnapshotIn = response.data.data
    return { kind: "ok", data }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}
