import { VNode } from "./types";

let currentVNode: VNode | null = null;
let currentIdx: number = 0;

export const setCurrentVNode = (v: VNode | null) => {
  currentVNode = v;
  currentIdx = 0;
  if (currentVNode) {
    currentVNode._hooks = currentVNode._hooks || [];
  }
};

const hookFactory = <T = any>(initHook: () => T) => {
  if (!currentVNode!._hooks![currentIdx]) {
    (currentVNode as any)!._hooks = [
      ...(currentVNode as any)!._hooks,
      initHook(),
    ];
  }

  const current: any = currentVNode!._hooks![currentIdx];
  currentIdx = currentIdx + 1;

  return current as T;
};

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
