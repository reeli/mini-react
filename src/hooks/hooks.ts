import {hookFactory} from "./index";

export const useState = <TValue = any>(initialValue?: TValue) => {
  return hookFactory(() => {
    let value: TValue | undefined = initialValue;

    const setValue = (nextValue: TValue) => {
      value = nextValue;
    };

    return [value, setValue] as const;
  });
};

export const useRef = <T>(data: T) => {
  return hookFactory(() => {
    const refObj: { current: T } = {
      current: data,
    };

    return refObj;
  });
};
