/* @jsx createElement */
// @ts-ignore
import { createElement } from "../../create-element";
import { useState, useRef } from "../hooks";
import { render } from "../../render";

describe("#useState", () => {
  it("should set initial state correctly", () => {
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

  it("should update state correctly", () => {
    const root = document.createElement("div");

    let mySetState: any;

    const Foo = () => {
      const [count, setState] = useState(10);
      mySetState = setState;

      return <span>{count}</span>;
    };

    render(root, <Foo />);
    expect(root.innerHTML).toEqual(`<span>10</span>`);

    mySetState(20);
    expect(root.innerHTML).toEqual(`<span>20</span>`);
  });

  it("should set state two times correctly", () => {
    const root = document.createElement("div");

    let mySetState: any;

    const Foo = () => {
      const [count, setState] = useState(10);
      mySetState = setState;

      return <span>{count}</span>;
    };

    render(root, <Foo />);
    expect(root.innerHTML).toEqual(`<span>10</span>`);

    mySetState(20);
    expect(root.innerHTML).toEqual(`<span>20</span>`);

    mySetState(30);
    expect(root.innerHTML).toEqual(`<span>30</span>`);
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
