const toMatrix = (arr: any[], width: number) =>
  arr?.reduce(
    (rows, key, index) =>
      (index % width === 0
        ? rows.push({
          key: index,
          value: [key],
        })
        : rows[rows.length - 1].value.push(key)) && rows,
    [],
  );

function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}


export const algorithm = { toMatrix, padWithLeadingZeros }
