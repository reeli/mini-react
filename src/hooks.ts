import { VNode, Hook } from "./types";

let currentVNode: VNode | null = null;
let currentIdx: number = 0;

export const setCurrentVNode = (v: VNode | null) => {
  currentVNode = v;
  currentIdx = 0;
  if (currentVNode) {
    currentVNode._hooks = currentVNode._hooks || [];
  }
};

export const useState = <TValue = any>(initialValue?: TValue): Hook => {
  if (!currentVNode!._hooks![currentIdx]) {
    let _value: TValue | undefined = initialValue;

    const _setValue = (nextValue: TValue) => {
      _value = nextValue;
    };

    const _hook: Hook = [_value, _setValue];

    currentVNode!._hooks = [...currentVNode!._hooks!, _hook];
  }

  const res = currentVNode!._hooks![currentIdx];
  currentIdx = currentIdx + 1;

  return res;
};

export const useRef = <T>(data: T) => {
  if (!currentVNode!._hooks![currentIdx]) {
    const refObj: any = {
      current: data,
    };

    (currentVNode as any)!._hooks.push(refObj);
  }

  const res: any = currentVNode!._hooks![currentIdx];
  currentIdx = currentIdx + 1;

  return res as { current: T };
};
