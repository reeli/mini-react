import { flat } from "./utils";
import {VChildNode, VNode, AnyObject} from "./types";

export const createElement = (
  type: string | Function,
  props: AnyObject|null,
  ...children: VChildNode[]
) => {
  return {
    type,
    props: {
      ...(props || {}),
      children: children ? flat(children) : null,
    },
  };
};

export const createTextVNode = (text: string | number): VNode => {
  return {
    type: "textNode",
    props: {
      content: text,
    },
  };
};
