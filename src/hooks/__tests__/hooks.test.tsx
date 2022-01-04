/* @jsx createElement */
// @ts-ignore
import { createElement } from "../../create-element";
import { useState, useRef, useEffect } from "../hooks";
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

describe("useEffect", () => {
  it("should not invoke useEffect callback when first render", () => {
    const root = document.createElement("div");
    let value = 0;

    const Foo = () => {
      useEffect(() => {
        value = value + 1;
      }, []);

      return <span>test</span>;
    };

    render(root, <Foo />);
    expect(value).toEqual(1);
  });

  it("should not invoke useEffect callback if deps empty", () => {
    const root = document.createElement("div");
    let value = 0;

    const Foo = () => {
      useEffect(() => {
        value = value + 1;
      }, []);

      return <span>test</span>;
    };

    render(root, <Foo />);
    expect(value).toEqual(1);

    render(root, <Foo />);
    expect(value).toEqual(1);
  });

  it("should invoke useEffect callback if deps ist not change", () => {
    const root = document.createElement("div");
    let value = 0;
    let count = 1;

    const Foo = () => {
      useEffect(() => {
        value = value + 1;
      }, [count]);

      return <span>test</span>;
    };

    render(root, <Foo />);
    expect(value).toEqual(1);

    render(root, <Foo />);
    expect(value).toEqual(1);
  });

  it("should invoke useEffect callback if deps changed", () => {
    const root = document.createElement("div");
    let value = 0;
    let count = 0;

    const Foo = () => {
      useEffect(() => {
        value = value + 1;
      }, [count]);

      return <span>test</span>;
    };

    render(root, <Foo />);
    expect(value).toEqual(1);

    count = 1;
    render(root, <Foo />);
    expect(value).toEqual(2);
  });

  it("should run cleanup function in useEffect", () => {
    const root = document.createElement("div");
    let value = 0;
    let count = 0;
    let num = 0;

    const Foo = () => {
      useEffect(() => {
        value = value + 1;
        console.log("in useffect")
        return () => {
          console.log("in cleanup")
          count = count + 1;
        };
      }, [num]);

      return <span>test</span>;
    };

    render(root, <Foo />);
    expect(count).toEqual(0);
    expect(value).toEqual(1);

    num = 1;
    render(root, <Foo />);
    expect(count).toEqual(1);
    expect(value).toEqual(2);
  });
});
