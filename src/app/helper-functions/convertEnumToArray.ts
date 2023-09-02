import { convertToLabel } from "./convertToLabel";

export function convertEnumToArray(e: { [key: string]: any }): EnumArrayItem[] {
  return Object.keys(e).map((key: string) => {
    let retVal = new EnumArrayItem(e[key], convertToLabel(key));
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