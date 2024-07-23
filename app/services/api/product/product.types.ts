export interface APIGetProductType{
  result: boolean,
  message: string,
  data:{
    id: number,
    code: string,
    name: string,
    price: number
  }[]
}
