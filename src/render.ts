import { VNode, AnyObject } from "./types";
import { isEqual, isVNode } from "./utils";
import { createTextVNode } from "./create-element";
import {setCurrentVNode} from "./hooks";

type FunctionVNode = Omit<VNode, "type"> & { type: Function };

const renderComponent = (vNode: FunctionVNode) => {
  setCurrentVNode(vNode);
  const componentRendered = vNode.type(vNode.props);
  setCurrentVNode(null);

  return componentRendered;
};

export const diff = (
  parentEl: HTMLElement,
  prev: VNode | null,
  current: VNode,
) => {
  if (!prev) {
    return create(parentEl, current);
  }

  if (typeof current.type === "function") {
    current._hooks = prev._hooks;

    if (!(current.props || {}).key && current.type !== prev.type) {
      setChildren(current, [renderComponent(current as FunctionVNode)]);
      commitChildren(parentEl, current._children);
      return;
    }

    setChildren(current, [renderComponent(current as FunctionVNode)]);
    diffChildren(parentEl, prev._children, current._children);
    return;
  }

  if (prev.type === current.type && isEqual(prev.props, current.props)) {
    return;
  }

  if (prev.type !== current.type) {
    create(parentEl, current, prev._html);
    prev._html?.remove();
    return;
  }

  const {
    children: prevChildren,
    key: prevKey,
    ...prevProps
  } = prev.props || {};
  const {
    children: currentChildren,
    key: currentKey,
    ...currentProps
  } = current.props || {};

  if (current.type === "textNode") {
    const textNode = document.createTextNode((current.props || {}).content);
    parentEl.insertBefore(textNode, prev._html || null);
    current._html = textNode;
    prev._html!.remove();
    return;
  }

  current._html = prev._html;

  if ((prevProps || currentProps) && !isEqual(prevProps, currentProps)) {
    diffProps(
      (current._html || parentEl) as HTMLElement,
      prevProps,
      currentProps,
    );
  }

  currentChildren && setChildren(current, currentChildren);

  if (prev._children || current._children) {
    diffChildren(
      (current._html || parentEl) as HTMLElement,
      prev._children,
      current._children,
    );
  }
};

const setChildren = (vNode: VNode, children: any[]) => {
  vNode._children = [];

  children.forEach((child) => {
    if (typeof child === "string" || typeof child === "number") {
      const textNode = createTextVNode(child);
      vNode._children?.push(textNode);
      return;
    }

    if (isVNode(child)) {
      vNode._children?.push(child);
      return;
    }
  });
};

const diffProps = (
  el: HTMLElement,
  prev: VNode["props"],
  current: VNode["props"],
) => {
  const prevProps = prev || {};
  const currentProps = current || {};
  const prevKeys = Object.keys(prevProps);
  const currentKeys = Object.keys(currentProps);

  currentKeys.forEach((k) => {
    if (prevKeys.includes(k) && currentProps[k] === prevProps[k]) {
      return;
    }

    el.setAttribute(k, currentProps[k]);
  });

  prevKeys.forEach((k) => {
    if (!currentKeys.includes(k)) {
      el.removeAttribute(k);
    }
  });
};

const diffChildren = (
  el: HTMLElement,
  prevChildren: VNode["_children"],
  currentChildren: VNode["_children"],
) => {
  if (!currentChildren || currentChildren.length == 0) {
    prevChildren?.forEach((v) => v._html?.remove());
    return;
  }

  const prevChildrenMap: AnyObject = {};

  prevChildren?.forEach((v, idx) => {
    prevChildrenMap[(v.props || {}).key || idx] = v;
  });

  currentChildren?.forEach((currentChild, idx) => {
    const currentKey = (currentChild.props || {})["key"] || idx;
    const prevChild = prevChildrenMap[currentKey] || null;

    diff(el, prevChild, currentChild);

    delete prevChildrenMap[currentKey];
  });

  Object.values(prevChildrenMap)?.forEach((prev) => {
    prev._html?.remove();
  });
};

function commitChildren(parentEl: HTMLElement, children: VNode[] = []) {
  children?.forEach((child) => {
    create(parentEl, child);
  });
}

const create = (
  parentEl: HTMLElement,
  vNode: VNode,
  beforeEl?: VNode["_html"],
) => {
  if (typeof vNode.type === "function") {
    const _children = renderComponent(vNode as FunctionVNode);
    vNode._children = [_children];

    create(parentEl, _children, beforeEl);
    return;
  }

  if (vNode.type === "textNode") {
    const textNode = document.createTextNode((vNode.props || {}).content);
    parentEl.insertBefore(textNode, beforeEl || null);
    vNode._html = textNode;
    return;
  }

  const element = document.createElement(vNode.type);
  const { children, key, ...otherProps } = vNode.props || {};

  if (otherProps) {
    Object.keys(otherProps).forEach((key) => {
      element.setAttribute(key, otherProps[key]);
    });
  }

  parentEl.insertBefore(element, beforeEl || null);
  vNode._html = element;

  if (children) {
    setChildren(vNode, children);
    commitChildren(element, vNode._children);
  }
};

export const render = (
  parentEl: HTMLElement & { vDOM?: VNode },
  vNode: VNode,
) => {
  parentEl.vDOM
    ? diff(parentEl, parentEl.vDOM, vNode)
    : create(parentEl, vNode);
  parentEl.vDOM = vNode;
};
