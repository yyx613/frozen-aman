import { Customer } from "app/services/api/task/task.type";
import Moment from "moment"
import { dateTime } from "./dateTime"


export const sortCustomerListByCode = (list: Customer[]) => {
  if (list.length === 0) return list

  return list?.sort((a, b) => {

    const getCode = (item) => item?.customer.code?.replace(/[^\w]/g, "");

    const codeA = getCode(a);
    const codeB = getCode(b);

    // Compare alphabetically first
    const compareAlphabetically = codeA?.localeCompare(codeB);

    if (compareAlphabetically === 0) {
      // If the codes are equal alphabetically, compare the numeric part
      const numA = parseInt(a.code?.match(/\d+/)[0], 10);
      const numB = parseInt(b.code?.match(/\d+/)[0], 10);
      return numA - numB;
    }

    return compareAlphabetically;
  });
}

export const sortListByDateTime=({list, dateName})=>{
    return [...list].sort((a, b) => new Moment(b[dateName], dateTime.BACK_END_TIME) - new Moment(a[dateName], dateTime.BACK_END_TIME));
}
