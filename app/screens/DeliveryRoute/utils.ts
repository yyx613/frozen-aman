export const toMatrix = (arr: any[], width: number) =>
  arr.reduce(
    (rows, key, index) =>
      (index % width === 0
        ? rows.push({
          key: index,
          value: [key],
        })
        : rows[rows.length - 1].value.push(key)) && rows,
    [],
  );

export function updateProductQuantity(productQuantity: { [key: string]: number }, productName: string, quantity: number) {
  const currentQuantity = productQuantity[productName]
  productQuantity[productName] = currentQuantity + (quantity)
}
