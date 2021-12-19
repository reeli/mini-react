import {hookFactory} from "./index";

export const useState = <TValue = any>(initialValue?: TValue) => {
  const res = hookFactory(() => {
    let state = {
      value: initialValue,
      setValue: (_value: TValue) => {},
    };

    const setValue = (nextValue: TValue) => {
      // TODO: if value is equal to next value
      state.value = nextValue;
      // currentVNode._render!(currentVNode);
    };

    state.setValue = setValue;

    return state;
  });

  return [res.value, res.setValue];
};

export const useRef = <T>(data: T) => {
  return hookFactory(() => {
    const refObj: { current: T } = {
      current: data,
    };

    return refObj;
  });
};
