import { AuthenticationStoreSnapshot } from "../../../models"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import { ApiCheckSession, ApiLoginResponse, ApiLogoutResponse } from "./auth.types"

export const callLogin = async ({ employeeId, password }): Promise<{
  kind: "ok";
  auth: AuthenticationStoreSnapshot
} | GeneralApiProblem> => {
  // make the api call
  const response: ApiResponse<ApiLoginResponse> = await api.apiSauce.post(
    `${apiEndpoint.auth}/login`, { employeeid: employeeId, password },
  )

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  // transform the data into the format we are expecting
  try {
    const auth: AuthenticationStoreSnapshot = response.data.data
    return { kind: "ok", auth }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}


export const callLogout = async ({ session }): Promise<{
  kind: "ok";
} | GeneralApiProblem> => {
  // make the api call
  const response: ApiResponse<ApiLogoutResponse> = await api.apiSauce.post(
    `${apiEndpoint.auth}/logout`, { session },
  )

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  return { kind: "ok" }
}

export const callCheckSession = async ({ session }): Promise<{
  kind: "ok";
} | GeneralApiProblem> => {
  // make the api call
  const response: ApiResponse<ApiCheckSession> = await api.apiSauce.post(
    `${apiEndpoint.auth}/session`, { session },
  )
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  return { kind: "ok" }
}
