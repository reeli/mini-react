import {hookFactory} from "./index";

export const useState = <TValue = any>(initialValue?: TValue) => {
  const res = hookFactory((currentVNode) => {
    const state = {
      value: initialValue,
      setValue: (_value: TValue) => {},
      currentVNode: currentVNode,
    };

    const setValue = (nextValue: TValue) => {
      // TODO: if value is equal to next value
      state.value = nextValue;
      state.currentVNode._render!();
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

    return {refObj};
  }).refObj;
};
