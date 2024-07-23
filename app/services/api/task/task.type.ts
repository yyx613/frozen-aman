interface Product {
    id: number,
    code: string,
    name: string
    price: number
}

interface FOCProduct {
    id: number,
    product_id: number,
    customer_id: number,
    achivequantity: number,
    quantity: number,
    free_product_id: number,
    free_quantity: number,
    startdate: string,
    enddate: string,
}

export interface GroupCompany {
    id: number,
    code: string,
    name: string,
    ssm: string,
    address1: string,
    address2: string,
    address3: string,
    address4: string,
    group_id: number,
}
export interface Customer {
    id: number,
    code: string,
    company: string,
    paymentterm: number,
    phone: string,
    address: string,
    status: number,
    credit: number,
    activefoc: FOCProduct[]
    product: Product[]
    groupcompany: GroupCompany
}

interface Invoice {
    invoiceno: string,
    date: string,
    remark: string,
    invoicedetail:
    {
        id: number,
        product_id: number,
        quantity: number,
        price: number,
        totalprice: number,
    }[]

}
export interface ApiGetTaskResponse {
    result: boolean,
    message: string,
    data: {
        task: {
            id: number,
            date: string,
            customer_id: number,
            sequence: number,
            invoice_id: number,
            status: number,
            customer: Customer,
            invoice: Invoice,
            based: number
        }
    }
}

export interface ApiAddInvoice {
    result: boolean,
    message: string,
    data: {
        id: number,
        invoiceno: string,
        remark: string,
        newcredit: number,
    }
}

export interface ApiAddInvoiceProps {
    date: string,
    customerId: number,
    remark?: string,
    invoiceId?: number,
    invoiceNo?: string,
    paymentType: number,
    invoiceDetail: {
        product_id: number,
        quantity: number,
        price: number,
        foc: boolean
    }[]
}

export interface ApiAddTaskTransferProps {
    driverId: number,
    transferDetail: {
        task_id: number,
    }[]
}

export interface ApiCallTaskTransferDriverResponse {
    result: boolean,
    message: string,
    data: {
        id: number,
        name: string,
        employeeid: string,
    }[]
}

export interface ApiGetTaskTransferredList {
    result: boolean,
    message: string,
    data: {
        id: number,
        fromdriver: {
            id: number,
            name: string,
        },
        todriver: {
            id: number,
            name: string
        },
        task: {
            id: number,
            date: string,
            customer: Customer
        }
    }[]
}
