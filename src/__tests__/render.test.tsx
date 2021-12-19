/* @jsx createElement */
import { createElement } from "../create-element";
import { render } from "../render";
import { useState, useRef } from "../hooks";

describe("render", () => {
  it("should handle html elements when first render", () => {
    const root = document.createElement("div");

    render(root, <div id={"container"}>hello-world</div>);

    expect(root.innerHTML).toEqual(`<div id="container">hello-world</div>`);
  });

  it("should handle components when first render", () => {
    const root = document.createElement("div");

    const Foo = (props: any) => (
      <div>
        {props.name}
        <span id={"children"}>{props.children}</span>
      </div>
    );

    render(root, <Foo name={"hello"}>hello-world</Foo>);

    expect(root.innerHTML).toEqual(
      `<div>hello<span id="children">hello-world</span></div>`,
    );
  });

  it("should rerender html element", () => {
    const div = document.createElement("div");

    render(div, <div id={"my-div"}>hello-world</div>);
    expect(div.innerHTML).toEqual(`<div id="my-div">hello-world</div>`);

    render(div, <div id={"my-div2"}>hello-world2</div>);
    expect(div.innerHTML).toEqual(`<div id="my-div2">hello-world2</div>`);
  });

  it("should render html with multiple child element", () => {
    const div = document.createElement("div");

    render(
      div,
      <div id={"my-div"}>
        <span id={"content"}>my content</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );
  });

  it("should render VNode to html with VNode children", () => {
    const div = document.createElement("div");

    render(
      div,
      <div id="my-div">
        <span id="content">my content</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );

    const preDiv = div.querySelector("#my-div");

    render(
      div,
      <div id="my-div-2">
        <span id="content">my content</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div-2"><span id="content">my content</span></div>`,
    );

    expect(div.querySelector("#my-div-2")).toEqual(preDiv);
  });

  it("should render new added attributes", () => {
    const div = document.createElement("div");

    render(
      div,
      <div id="my-div">
        <span id="content">my content</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );

    render(
      div,
      <div id="my-div-2" role="good">
        <span id="content">my content</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div-2" role="good"><span id="content">my content</span></div>`,
    );
  });

  it("should diff single child", () => {
    const div = document.createElement("div");

    render(
      div,
      <div id="my-div">
        <span id="content">my content</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );

    render(
      div,
      <div id="my-div-2">
        <span id="content2">my content2</span>
      </div>,
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div-2"><span id="content2">my content2</span></div>`,
    );
  });

  it("should diff with multiple child", () => {
    const root = document.createElement("div");

    render(
      root,
      <div id="root">
        <span id="content1">1</span>
        <span id="content2">2</span>
      </div>,
    );
    expect(root.innerHTML).toEqual(
      `<div id="root"><span id="content1">1</span><span id="content2">2</span></div>`,
    );

    const prevContent1 = root.querySelector("#content1");
    const prevContent2 = root.querySelector("#content2");

    render(
      root,
      <div id="div-3">
        <div id="content3">3</div>
        <span id="content2">2</span>
      </div>,
    );
    const currentContent2 = root.querySelector("#content2");
    const currentContent3 = root.querySelector("#content3");

    expect(prevContent1).not.toEqual(currentContent3);
    expect(prevContent2).toEqual(currentContent2);

    expect(root.innerHTML).toEqual(
      `<div id="div-3"><div id="content3">3</div><span id="content2">2</span></div>`,
    );
  });

  it("should diff components", () => {
    const root = document.createElement("div");
    const Foo = (props: any) => (
      <div id="foo">
        <span>{props.greet}</span>
        {props.children}
      </div>
    );

    render(
      root,
      <Foo greet={"hello"}>
        <span>content1</span>
      </Foo>,
    );

    const prevContent = root.querySelector("#foo");
    expect(root.innerHTML).toEqual(
      `<div id="foo"><span>hello</span><span>content1</span></div>`,
    );

    render(
      root,
      <Foo greet={"good"}>
        <span>content2</span>
      </Foo>,
    );
    expect(root.innerHTML).toEqual(
      `<div id="foo"><span>good</span><span>content2</span></div>`,
    );

    const currentContent = root.querySelector("#foo");
    expect(prevContent).toEqual(currentContent);
  });

  it("should handle text content in component children", () => {
    const root = document.createElement("div");

    render(
      root,
      <div id="hello">
        <span>content1</span>content2
      </div>,
    );

    expect(root.innerHTML).toEqual(
      `<div id="hello"><span>content1</span>content2</div>`,
    );
  });

  it("should diff children with key", () => {
    const root = document.createElement("div");

    render(
      root,
      <div id="foo">
        <span id="el1" key="el1">
          element1
        </span>
        <span id="el2" key="el2">
          element2
        </span>
        <span id="el3" key="el3">
          element3
        </span>
      </div>,
    );

    const prevEl3 = root.querySelector("#el3");

    render(
      root,
      <div id="foo">
        <span id="el3" key="el3">
          element3
        </span>
        <span id="el4" key="el4">
          element4
        </span>
        <span id="el5" key="el5">
          element5
        </span>
      </div>,
    );

    const currentEl3 = root.querySelector("#el3");

    expect(prevEl3).toEqual(currentEl3);
    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el3">element3</span><span id="el4">element4</span><span id="el5">element5</span></div>`,
    );
  });

  it("should diff children without key", () => {
    const root = document.createElement("div");
    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
        <span id="el2">element2</span>
        <span id="el3">element3</span>
      </div>,
    );

    const prevEl1 = root.querySelector("#el1");
    const prevEl2 = root.querySelector("#el2");
    const prevEl3 = root.querySelector("#el3");

    render(
      root,
      <div id="foo">
        <span id="el3">element3</span>
        <span id="el2">element2</span>
        <span id="el1">element1</span>
      </div>,
    );

    const currentEl1 = root.querySelector("#el1");
    const currentEl2 = root.querySelector("#el2");
    const currentEl3 = root.querySelector("#el3");

    expect(prevEl1).not.toEqual(currentEl1);
    expect(prevEl3).not.toEqual(currentEl3);
    expect(prevEl2).toEqual(currentEl2);

    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el3">element3</span><span id="el2">element2</span><span id="el1">element1</span></div>`,
    );
  });

  it("should diff children with more prev children and less current children", () => {
    const root = document.createElement("div");

    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
        <span id="el2">element2</span>
        <span id="el3">element3</span>
      </div>,
    );

    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
        <span id="el2">element2</span>
      </div>,
    );

    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el1">element1</span><span id="el2">element2</span></div>`,
    );
  });

  it("should diff children with less prev children and more current children", () => {
    const root = document.createElement("div");

    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
      </div>,
    );
    const prevEl1 = root.querySelector("#el1");

    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
        <span id="el2">element2</span>
      </div>,
    );

    const currentEl1 = root.querySelector("#el1");

    expect(prevEl1).toEqual(currentEl1);
    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el1">element1</span><span id="el2">element2</span></div>`,
    );
  });

  it("should diff children when prev children is null", () => {
    const root = document.createElement("div");

    render(root, createElement("div", { id: "foo" }));

    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
      </div>,
    );

    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el1">element1</span></div>`,
    );
  });

  it("should diff children when current children is null", () => {
    const root = document.createElement("div");

    render(
      root,
      <div id="foo">
        <span id="el1">element1</span>
      </div>,
    );

    render(root, createElement("div", { id: "foo" }));

    expect(root.innerHTML).toEqual(`<div id="foo"></div>`);
  });
});

describe('#useState', () => {
  it("should set state", () => {
    const root = document.createElement("div");

    const Foo = () => {
      const [count1] = useState(10);
      const [count2] = useState(8);
      return (
        <div>
          <span id={"children1"}>{count1}</span>
          <span id={"children2"}>{count2}</span>
        </div>
      );
    };

    render(root, <Foo />);

    expect(root.innerHTML).toEqual(
      `<div><span id="children1">10</span><span id="children2">8</span></div>`,
    );
  });
});

describe("#useRef", () => {
  it("should set ref correctly", () => {
    const root = document.createElement("div");
    const refValue = { a: 10 };

    const Foo = () => {
      const myRef = useRef(refValue);
      myRef.current.a = 20;

      return <span>test</span>;
    };

    render(root, <Foo />);

    expect(refValue.a).toEqual(20);
  });

  it("should get prev ref value correctly when rerender", () => {
    const root = document.createElement("div");
    let prevRefValue = 0;

    const Foo = () => {
      const myRef = useRef(10);
      prevRefValue = myRef.current;

      myRef.current = 20;

      return <span>test</span>;
    };

    render(root, <Foo />);
    expect(prevRefValue).toEqual(10);

    render(root, <Foo />);
    expect(prevRefValue).toEqual(20);
  });
});
