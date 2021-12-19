import {VNode} from "../types";

let currentVNode: VNode | null = null;
let currentIdx: number = 0;

export const setCurrentVNode = (v: VNode | null) => {
  currentVNode = v;
  currentIdx = 0;
  if (currentVNode) {
    currentVNode._hooks = currentVNode._hooks || [];
  }
};

export const hookFactory = <T = any>(initHook: (currentVNode: VNode) => T) => {
  if (!currentVNode!._hooks![currentIdx]) {
    (currentVNode as any)!._hooks = [
      ...(currentVNode as any)!._hooks,
      initHook(currentVNode!),
    ];
  }

  const current: any = currentVNode!._hooks![currentIdx];
  currentIdx = currentIdx + 1;

  current.currentVNode = currentVNode

  return current as T;
};
