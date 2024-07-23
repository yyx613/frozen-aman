import { DashboardSnapshotIn } from "../../../models"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import { ApiDashboardResponse } from "./dashboard.types"


export const callDashboard = async ({ date }): Promise<{
  kind: "ok";
  dashboard: DashboardSnapshotIn
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiDashboardResponse> = await api.apiSauce.post(
    `${apiEndpoint.dashboard}`, { date });


  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

  try {
    const dashboard: DashboardSnapshotIn = response.data.data
    return { kind: "ok", dashboard }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}
