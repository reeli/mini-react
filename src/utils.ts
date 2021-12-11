import { VNode, AnyObject } from "./types";

export const isObject = (data: any) =>
  typeof data === "object" && data !== null;

export const flat = (data: any[]): any[] => {
  return data.reduce((res, item) => {
    if (Array.isArray(item)) {
      return [...res, ...flat(item)];
    }

    return [...res, item];
  }, []);
};

export const isEqual = (a?: any, b?: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const isFunction = (data: any): data is Function =>
  typeof data === "function";

export const isTextNode = (data: any) => data === "textNode";

export const isVNode = (v: any): v is VNode => isObject(v);

export const omit = (obj: AnyObject, key: string): AnyObject =>
  Object.keys(obj)
    .filter((v) => v !== key)
    .reduce((res, k) => {
      return {
        ...res,
        [k]: obj[k],
      };
    }, {});

export const stringifyHTML = (e: HTMLElement = {} as any) =>
  `${e.tagName} ${Object.keys(e.attributes || {})
    .map((_, idx) => `${e.attributes[idx].name}=${e.attributes[idx].value}`)
    .join(" ")} ${e.innerHTML}`;
