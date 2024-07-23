export interface AppiCheckTripResponse {
  result: boolean,
  message: string,
  data: {
    status: boolean,
    trip: {
      id: number,
      date: string,
      driver_id: number,
      kelindan_id: number,
      lorry_id: number,
      type: number,
    }
  }
}

export interface ApiStartTripResponse {
  result: boolean,
  message: string,
  data: {
    driver_id: number,
    kelindan_id: number,
    lorry_id: number,
    date: string
  }
}


export interface ApiGetKelindanResponse {
  result: boolean,
  message: string,
  data: {
    id: number,
    name: string
  }[]
}

export interface ApiGetLorryResponse {
  result: boolean,
  message: string,
  data: {
    id: number,
    lorryno: string
  }[]
}