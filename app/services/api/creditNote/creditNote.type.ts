import { GroupCompany } from "../task/task.type"

export interface CustomerDetails {
    id: number,
    code: string,
    company: string,
    paymentterm: number,
    phone: string,
    address: string,
    groupcompany: GroupCompany
}
export interface ApiGetCustomerResponse {
    result: boolean,
    message: string,
    data: CustomerDetails
}

interface CustomerHistoryType {
    date: string,
    id: number,
    name: string,
    amount: number,
    type: string
}

export interface ApiCustomerHistory {
    result: boolean,
    message: string,
    data: {
        customerDetails: CustomerHistoryType[]
    }
}

export interface InvoiceProduct {
    product_id: number,
    quantity: number,
    price: number,
    totalprice: number,
}

export interface ApiInvoiceDetails {
    result: boolean,
    message: string,
    data: {
        id: number,
        invoiceno: string,
        date: string,
        customer_id: number,
        status: 1,
        remark: null,
        newcredit: number,
        invoicedetail: InvoiceProduct[],
        customer: CustomerDetails
    }
}


export interface ApiMakeCreditNotePayment {
    result: boolean,
    message: string,
    data: {
        newcredit: number
    }
}
