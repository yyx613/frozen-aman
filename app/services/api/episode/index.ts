import { EpisodeSnapshotIn } from "../../../models"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { ApiFeedResponse } from "./episode.types"

export const callEpisode = async (): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> => {
  // make the api call
  const response: ApiResponse<ApiFeedResponse> = await api.apiSauce.post(
    `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
  )

// the typical ways to die when calling an api
  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem
  }

// transform the data into the format we are expecting
  try {
    const rawData = response.data

    // This is where we transform the data into the shape we expect for our MST model.
    const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
      ...raw,
    }))

    return { kind: "ok", episodes }
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}
