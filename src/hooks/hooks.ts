import { hookFactory } from "./index";

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

    return { refObj };
  }).refObj;
};

type CleanUpFn = () => any;
type EffectFn = () => void | CleanUpFn;

const compareDeps = (data1: any[], data2?: any[]) => {
  if (!data2) {
    return true;
  }
  return !data1.every((el, idx) => el === data2[idx]);
};

export const useEffect = (callback: EffectFn, deps?: any[]) => {
  return hookFactory(
    (currentVNode) => {
      currentVNode._pendingEffects = currentVNode._pendingEffects || [];
      const state = {
        _value: callback,
        _deps: deps,
      };

      currentVNode._pendingEffects.push(state);
      return {};
    },
    (currentVNode) => {
      if (
        currentVNode._pendingEffects &&
        currentVNode._pendingEffects.length > 0
      ) {
        currentVNode._pendingEffects.forEach((effect) => {
          const hasNoDeps = !deps;
          const hasChangedDeps = effect._deps
            ? compareDeps(effect._deps, deps)
            : true;

          if (hasNoDeps || hasChangedDeps) {
            // TODO: run cleanup first and then run effect callback
            const cleanup = effect._value();

            if (cleanup && typeof cleanup === "function") {
              cleanup();
            }
          }
        });
      }
      return {};
    },
  );
};
