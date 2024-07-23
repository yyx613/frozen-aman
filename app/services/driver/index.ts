import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../api/utils"
import { AppiGetDriver } from "./driver.types"
import { DriverSnapshotIn } from "app/models"

export const callDriverList = async (): Promise<{
    kind: "ok";
    data: DriverSnapshotIn
} | GeneralApiProblem> => {
    const response: ApiResponse<AppiGetDriver> = await api.apiSauce.get(
        `${apiEndpoint.stock}/listdriver`)


    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
    }

    try {
        const data: DriverSnapshotIn = response.data.data
        return { kind: "ok", data }
    } catch (e) {
        if (__DEV__) {
            console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
    }
}