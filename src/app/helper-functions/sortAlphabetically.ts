
export function sortAlphabetically<T>(sortProperty: keyof T): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const aString: string = a[sortProperty] as string;
    const bString: string = b[sortProperty] as string;

    return aString.toLowerCase().localeCompare(bString.toLocaleLowerCase());
  };
}
