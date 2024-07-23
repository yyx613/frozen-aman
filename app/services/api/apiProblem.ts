import { ApiResponse } from "apisauce"

export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: "timeout",  message: string | null}
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect",  message: string | null }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server",  message: string | null}
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized", message: string | null }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden" , message: string | null}
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found" , message: string | null}
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected" , message: string | null}
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; message: string | null }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data" }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>): GeneralApiProblem | null {
  let message = ""
  if(response.data?.message.length > 0) {
    const errorMessage = response.data.message.split('|');
    message = errorMessage[1];
  }
  switch (response.problem) {
    case "CONNECTION_ERROR":
      return { kind: "cannot-connect", message: 'CONNECTION_ERROR' }
    case "NETWORK_ERROR":
      return { kind: "cannot-connect", message: 'NETWORK_ERROR'  }
    case "TIMEOUT_ERROR":
      return { kind: "timeout", message: 'TIMEOUT_ERROR'  }
    case "SERVER_ERROR":
      return { kind: "server", message: 'SERVER_ERROR'  }
    case "UNKNOWN_ERROR":
      return { kind: "unknown", message: 'UNKNOWN_ERROR'  }
    case "CLIENT_ERROR":
      switch (response.status) {
        case 401:
          return { kind: "unauthorized", message }
        case 403:
          return { kind: "forbidden", message  }
        case 404:
          return { kind: "not-found", message  }
        default:
          return { kind: "rejected", message  }
      }
    case "CANCEL_ERROR":
      return null
  }

  return null
}
