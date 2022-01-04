export type AnyObject = Record<string, any>;
export type VChildNode = VNode | boolean | string | number | undefined | null;

export type Hook = [value: any, setValue: (value: any) => any];

export interface VNode {
  type: string | Function;
  props: {
    key?: string | number;
    [key: string]: any;
    children?: VChildNode[] | null;
  } | null;
  _children?: VNode[]; // output: type(props)
  _html?: HTMLElement | Text;
  _hooks?: Hook[];
  _render?: () => any;
  _pendingEffects?: any[];
}

export type ComponentVNode = Omit<VNode, "type"> & { type: Function };
export type ElementVNode = Omit<VNode, "type"> & { type: string };
export type TextVNode = Omit<VNode, "type"> & { type: "textNode" };
