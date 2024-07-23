import { ApiAddInvoice } from "../task/task.type"
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { ApiResponse } from "apisauce"
import { api } from "../api"
import { apiEndpoint } from "../utils"
import { ApiReturnStockProps } from "./return.type"

export const callReturnStocks = async (props: ApiReturnStockProps): Promise<{
  kind: 'ok',
  data,
  message: string
} | GeneralApiProblem> => {
  const {
    date,
    customerId,
    remark,
    returnId,
    returnNo,
    paymentType,
    returnDetail
  } = props


  const response: ApiResponse<ApiAddInvoice> =
    await api.apiSauce.post(apiEndpoint.return, {
      date,
      customer_id: customerId,
      remark,
      return_id: returnId,
      returnno: returnNo,
      type: paymentType,
      returndetail: returnDetail
    });

  if (!response.ok) {
    const problem = getGeneralApiProblem(response)
    if (problem) return problem;
  }

  try {
    const data = response.data.data;
    return { kind: "ok", data, message: response.data.message };
  } catch (e) {
    if (__DEV__) {
      console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
    }
    return { kind: "bad-data" }
  }
}

