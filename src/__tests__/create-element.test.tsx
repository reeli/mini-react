import { createElement } from "../create-element";

describe("createElement", () => {
  it("should create html element", () => {
    expect(createElement("div", { id: "my-div", content: 123 }, null)).toEqual({
      type: "div",
      props: {
        id: "my-div",
        content: 123,
        children: null,
      },
    });
  });

  it("should create html element with multiple child", () => {
    expect(
      createElement("div", { id: "name" }, [
        createElement("span", null, null),
        "rui",
      ]),
    ).toEqual({
      type: "div",
      props: {
        id: "name",
        children: [{ type: "span", props: { children: null } }, "rui"],
      },
    });
  });

  it("should create component without props and children", () => {
    const Foo = () => createElement("div", { id: "foo" }, [1]);
    expect(createElement(Foo, {}, null)).toEqual({
      type: Foo,
      props: {
        children: null,
      },
    });
  });

  it("should create component with multiple child", () => {
    const Foo = (props: any) => {
      return createElement("div", { id: "foo" }, [
        createElement("span", null, [props.greet]),
        props.children,
      ]);
    };

    expect(Foo({ greet: "hello", children: "content" })).toEqual({
      type: "div",
      props: {
        id: "foo",
        children: [
          {
            type: "span",
            props: {
              children: ["hello"],
            },
          },
          "content",
        ],
      },
    });
    expect(createElement(Foo, { greet: "hello" }, ["content1"])).toEqual({
      type: Foo,
      props: { greet: "hello", children: ["content1"] },
    });
  });
});
