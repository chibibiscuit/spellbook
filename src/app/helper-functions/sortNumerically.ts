export function sortNumerically<T>(sortProperty: keyof T): (a: T, b: T) => -1 | 0 | 1 {
  return (a: T, b: T) => {
    if (a[sortProperty] === b[sortProperty])
      return 0;

    return a[sortProperty] > b[sortProperty] ? 1 : -1;
  };
}
