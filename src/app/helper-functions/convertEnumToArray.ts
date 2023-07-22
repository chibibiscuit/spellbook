import { convertToLabel } from "./convertToLabel";

export function convertEnumToArray(e: { [key: string]: any }): EnumArrayItem[] {
  console.log("🚀 ~ file: convertEnumToArray.ts:4 ~ convertEnumToArray ~ e:", e)
  return Object.keys(e).map((key: string) => {
    console.log("🚀 ~ file: convertEnumToArray.ts:8 ~ returnObject.keys ~ key:", key, e[key])
    let retVal = new EnumArrayItem(e[key], convertToLabel(key));
    console.log("🚀 ~ file: convertEnumToArray.ts:8 ~ returnObject.keys ~ retVal:", retVal)
    return retVal
  });
}

export class EnumArrayItem {
  constructor(
    public id: number|string,
    public name: string
  ) { }
}
// export class EnumArrayItem {
//   id: number|string;
//   name: string;

//   constructor(id: string, name: string) {
//     this.id = id;
//     this.name = name;
//   }
// }