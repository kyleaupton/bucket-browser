// import { toRaw, isRef, isReactive, isProxy } from 'vue';

// export function deepToRaw(sourceObj: any): any {
//   const objectIterator = (input: any): any => {
//     if (Array.isArray(input)) {
//       return input.map((item) => objectIterator(item));
//     }
//     if (isRef(input) || isReactive(input) || isProxy(input)) {
//       return objectIterator(toRaw(input));
//     }
//     if (input && typeof input === 'object') {
//       return Object.keys(input).reduce((acc, key) => {
//         acc[key as keyof typeof acc] = objectIterator(input[key]);
//         return acc;
//       }, {} as any);
//     }
//     return input;
//   };

//   return objectIterator(sourceObj);
// }

export const serialize = <T extends any[]>(...args: T) => {
  return JSON.parse(JSON.stringify(args)) as T;
};
