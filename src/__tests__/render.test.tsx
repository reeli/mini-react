import { createElement } from "../create-element";
import { render } from "../render";

describe("render", () => {
  it("should handle html elements when first render", () => {
    const root = document.createElement("div");
    const vNode = createElement("div", { id: "container" }, "hello-world");

    render(root, vNode);

    expect(root.innerHTML).toEqual(`<div id="container">hello-world</div>`);
    // expect((root as any).vDOM._children).toEqual([
    //   { type: "textNode", props: { content: "hello-world" } },
    // ]);
    // expect((root as any).vDOM._html).toBeTruthy();
  });

  it("should handle components when first render", () => {
    const root = document.createElement("div");
    const Foo = (props: any) =>
      createElement("div", null, props.name,
        createElement("span", { id: "children" }, props.children),);

    render(root, createElement(Foo, { name: "hello" }, "hello-world"));

    expect(root.innerHTML).toEqual(
      `<div>hello<span id="children">hello-world</span></div>`,
    );
    // expect((root as any).vDOM._children).toBeTruthy();
    // expect((root as any).vDOM._html).toBeTruthy();
  });

  it("should rerender html element", () => {
    const div = document.createElement("div");
    render(div, createElement("div", { id: "my-div" }, "hello-world"));
    expect(div.innerHTML).toEqual(`<div id="my-div">hello-world</div>`);

    render(div, createElement("div", { id: "my-div2" }, "hello-world2"));
    expect(div.innerHTML).toEqual(`<div id="my-div2">hello-world2</div>`);
  });

  it("should render html with multiple child element", () => {
    const div = document.createElement("div");
    const child = createElement("span", { id: "content" }, "my content");
    render(div, createElement("div", { id: "my-div" }, child));

    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );
  });

  it("should render VNode to html with VNode children", () => {
    const div = document.createElement("div");
    const child = createElement("span", { id: "content" }, "my content");

    render(div, createElement("div", { id: "my-div" }, child));
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );

    const preDiv = div.querySelector("#my-div");

    render(div, createElement("div", { id: "my-div-2" }, child));
    expect(div.innerHTML).toEqual(
      `<div id="my-div-2"><span id="content">my content</span></div>`,
    );

    expect(div.querySelector("#my-div-2")).toEqual(preDiv);
  });

  it("should render new added attributes", () => {
    const div = document.createElement("div");
    const child = createElement("span", { id: "content" }, "my content");

    render(div, createElement("div", { id: "my-div" }, child));
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );

    render(
      div,
      createElement("div", { id: "my-div-2", name: "good" }, child),
    );
    expect(div.innerHTML).toEqual(
      `<div id="my-div-2" name="good"><span id="content">my content</span></div>`,
    );
  });

  it("should diff single child", () => {
    const div = document.createElement("div");
    const child1 = createElement("span", { id: "content" }, "my content");

    render(div, createElement("div", { id: "my-div" }, child1));
    expect(div.innerHTML).toEqual(
      `<div id="my-div"><span id="content">my content</span></div>`,
    );

    const child2 = createElement("span", { id: "content2" }, "my content2");

    render(div, createElement("div", { id: "my-div-2" }, child2));
    expect(div.innerHTML).toEqual(
      `<div id="my-div-2"><span id="content2">my content2</span></div>`,
    );
  });

  it("should diff with multiple child", () => {
    const root = document.createElement("div");
    const child1 = createElement("span", { id: "content1" }, "1");
    const child2 = createElement("span", { id: "content2" }, "2");

    render(root, createElement("div", { id: "root" }, child1, child2));
    expect(root.innerHTML).toEqual(
      `<div id="root"><span id="content1">1</span><span id="content2">2</span></div>`,
    );

    const prevContent1 = root.querySelector("#content1");
    const prevContent2 = root.querySelector("#content2");

    const child3 = createElement("div", { id: "content3" }, "3");
    render(root, createElement("div", { id: "div-3" }, child3, child2));
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
    const Foo = (props: any) => {
      return createElement(
        "div",
        { id: "foo" },
        createElement("span", null, props.greet),
        props.children,
      );
    };

    render(
      root,
      createElement(
        Foo,
        { greet: "hello" },
        createElement("span", null, "content1"),
      ),
    );

    const prevContent = root.querySelector("#foo");
    expect(root.innerHTML).toEqual(
      `<div id="foo"><span>hello</span><span>content1</span></div>`,
    );

    render(
      root,
      createElement(
        Foo,
        { greet: "good" },
        createElement("span", null, "content2"),
      ),
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
      createElement(
        "div",
        { id: "hello" },
        createElement("span", null, "content1"),
        "content2",
      ),
    );

    expect(root.innerHTML).toEqual(
      `<div id="hello"><span>content1</span>content2</div>`,
    );
  });

  it("should diff children with key", () => {
    const root = document.createElement("div");
    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1", key: "el1" }, "element1"),
        createElement("span", { id: "el2", key: "el2" }, "element2"),
        createElement("span", { id: "el3", key: "el3" }, "element3"),
      ),
    );

    const prevEl3 = root.querySelector("#el3");

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el3", key: "el3" }, "element3"),
        createElement("span", { id: "el4", key: "el4" }, "element4"),
        createElement("span", { id: "el5", key: "el5" }, "element5"),
      ),
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
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
        createElement("span", { id: "el2" }, "element2"),
        createElement("span", { id: "el3" }, "element3"),
      ),
    );

    const prevEl1 = root.querySelector("#el1");
    const prevEl2 = root.querySelector("#el2");
    const prevEl3 = root.querySelector("#el3");

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el3" }, "element3"),
        createElement("span", { id: "el2" }, "element2"),
        createElement("span", { id: "el1" }, "element1"),
      ),
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
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
        createElement("span", { id: "el2" }, "element2"),
        createElement("span", { id: "el3" }, "element3"),
      ),
    );

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
        createElement("span", { id: "el2" }, "element2"),
      ),
    );

    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el1">element1</span><span id="el2">element2</span></div>`,
    );
  });

  it("should diff children with less prev children and more current children", () => {
    const root = document.createElement("div");

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
      ),
    );
    const prevEl1 = root.querySelector("#el1");

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
        createElement("span", { id: "el2" }, "element2"),
      ),
    );

    const currentEl1 = root.querySelector("#el1");

    expect(prevEl1).toEqual(currentEl1);
    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el1">element1</span><span id="el2">element2</span></div>`,
    );
  });

  it("should diff children when prev children is null", () => {
    const root = document.createElement("div");

    render(root, createElement("div", { id: "foo" }, ));

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
      ),
    );

    expect(root.innerHTML).toEqual(
      `<div id="foo"><span id="el1">element1</span></div>`,
    );
  });

  it("should diff children when current children is null", () => {
    const root = document.createElement("div");

    render(
      root,
      createElement(
        "div",
        { id: "foo" },
        createElement("span", { id: "el1" }, "element1"),
      ),
    );

    render(root, createElement("div", { id: "foo" }));

    expect(root.innerHTML).toEqual(`<div id="foo"></div>`);
  });
});
