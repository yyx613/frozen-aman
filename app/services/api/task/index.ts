import { TaskTransferDriverSnapshotIn } from './../../../models/taskTransfer/TaskTransfer';
import { GeneralApiProblem, getGeneralApiProblem } from "../apiProblem"
import { api } from "../api"
import { ApiResponse } from "apisauce"
import { apiEndpoint } from "../utils"
import { ApiAddInvoice, ApiGetTaskResponse, ApiAddInvoiceProps, ApiCallTaskTransferDriverResponse, ApiAddTaskTransferProps, ApiGetTaskTransferredList } from "./task.type"
import { TaskSnapshotIn } from "app/models/task"

export const callTask = async (): Promise<{
    kind: 'ok',
    data: TaskSnapshotIn,
} | GeneralApiProblem> => {
    const response: ApiResponse<ApiGetTaskResponse> = await api.apiSauce.get(apiEndpoint.task);

    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem;
    }

    try {
        const data: TaskSnapshotIn = response.data.data;

        if (!response.data.result) return { kind: 'not-found', message: response.data.message }
        return { kind: "ok", data };
    } catch (e) {
        if (__DEV__) {
            console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
    }
}

export const callAddInvoice = async (props: ApiAddInvoiceProps): Promise<{
    kind: 'ok',
    data,
    message: string
} | GeneralApiProblem> => {
    const {
        date,
        customerId,
        remark,
        invoiceId,
        invoiceNo,
        paymentType,
        invoiceDetail
    } = props

    const response: ApiResponse<ApiAddInvoice> =
        await api.apiSauce.post(apiEndpoint.invoice, {
            date,
            customer_id: customerId,
            remark,
            invoice_id: invoiceId,
            invoiceno: invoiceNo,
            type: paymentType,
            invoicedetail: invoiceDetail
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

export const callTaskTransferDriver = async (): Promise<{
    kind: 'ok',
    data: TaskTransferDriverSnapshotIn,
} | GeneralApiProblem> => {
    const response: ApiResponse<ApiCallTaskTransferDriverResponse> =
        await api.apiSauce.get(`${apiEndpoint.task}/listdriver`);
    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem;
    }

    try {
        const data: TaskTransferDriverSnapshotIn = response.data.data;

        if (!response.data.result) return { kind: 'not-found', message: response.data.message }
        return { kind: "ok", data };
    } catch (e) {
        if (__DEV__) {
            console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
    }
}

export const callAddTaskTransfer = async (props: ApiAddTaskTransferProps): Promise<{
    kind: 'ok',
    data,
    message: string
} | GeneralApiProblem> => {
    const {
        driverId,
        transferDetail
    } = props

    const response: ApiResponse<ApiAddInvoice> =
        await api.apiSauce.post(`${apiEndpoint.task}/push`, {
            driver_id: driverId,
            transferdetail: transferDetail
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

export const callTaskTransferredList = async (): Promise<{
    kind: 'ok',
    data: TaskTransferDriverSnapshotIn,
} | GeneralApiProblem> => {
    const response: ApiResponse<ApiGetTaskTransferredList> =
        await api.apiSauce.get(`${apiEndpoint.task}/listtranfer`);
    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem;
    }

    try {
        const data: TaskTransferDriverSnapshotIn = response.data.data;

        if (!response.data.result) return { kind: 'not-found', message: response.data.message }
        return { kind: "ok", data };
    } catch (e) {
        if (__DEV__) {
            console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: "bad-data" }
    }
}
