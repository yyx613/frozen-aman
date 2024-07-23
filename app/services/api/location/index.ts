import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import { ApiUpdateLocation } from "./location.types"


export const callUpdateLocation = async ({ date, latitude, longitude }): Promise<{
    kind: "ok";
} | GeneralApiProblem> => {
    // make the api call
    const response: ApiResponse<ApiUpdateLocation> = await api.apiSauce.post(
        `${apiEndpoint.auth}/location`, { date, latitude, longitude },
    )
    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
    }

    return { kind: "ok" }
}
