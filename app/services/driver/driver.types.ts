export interface AppiGetDriver {
    result: boolean,
    message: string,
    data: [
        {
            driver_id: number,
            name: string,
            employeeid: string
        }
    ]
}