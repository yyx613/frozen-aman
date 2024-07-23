import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { api } from "../api"
import { ApiResponse } from "apisauce"
import { ApiStartTripResponse, AppiCheckTripResponse, ApiGetKelindanResponse, ApiGetLorryResponse } from "./trip.types"
import { apiEndpoint } from "../utils"
import { TripSnapshotIn, KelindanSnapshotIn, LorrySnapshotIn } from "../../../models"


export const callCheckTrip = async (): Promise<{
  kind: 'ok',
  data: TripSnapshotIn,
} | GeneralApiProblem> => {
  const response: ApiResponse<AppiCheckTripResponse> = await api.apiSauce.get(apiEndpoint.trip);

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem;
  }

  try {
    const data: TripSnapshotIn = response.data.data;
    return { kind: "ok", data };
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callStartTrip = async ({ kelindan_id, lorry_id }): Promise<{
  kind: 'ok',
  data: TripSnapshotIn,
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiStartTripResponse> =
    await api.apiSauce.post(`${apiEndpoint.trip}/start`, { kelindan_id, lorry_id });
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem;
  }

  try {
    const data: TripSnapshotIn = response.data.data;
    return { kind: "ok", data };
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callEndTrip = async (props: { kelindan_id: number, lorry_id: number, wastage: any[], cash: number }): Promise<{
  kind: 'ok',
  data: TripSnapshotIn,
  message: string
} | GeneralApiProblem> => {
  const { kelindan_id, lorry_id, wastage, cash } = props
  const response: ApiResponse<ApiStartTripResponse> =
    await api.apiSauce.post(`${apiEndpoint.trip}/end`, { kelindan_id, lorry_id, wastage, cash });
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem;
  }

  try {
    const data: TripSnapshotIn = response.data.data;
    return { kind: "ok", data, message: response.data.message };
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callGetKelindan = async (): Promise<{
  kind: 'ok',
  data: KelindanSnapshotIn,
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiGetKelindanResponse> = await api.apiSauce.get(apiEndpoint.kelindan);
  console.log('getKelindan', response)

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem;
  }

  try {
    const data: KelindanSnapshotIn = response.data.data;
    return { kind: "ok", data };
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

export const callGetLorry = async (): Promise<{
  kind: 'ok',
  data: LorrySnapshotIn,
} | GeneralApiProblem> => {
  const response: ApiResponse<ApiGetLorryResponse> =
    await api.apiSauce.get(apiEndpoint.lorry);

  console.log('getLorry', response)
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem;
  }

  try {
    const data: LorrySnapshotIn = response.data.data;
    return { kind: "ok", data };
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

