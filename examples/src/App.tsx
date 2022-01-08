/* @jsx createElement */
import { createElement } from "../../src/create-element";

import { useState, useEffect, useRef } from "../../src/hooks/hooks";

function SayHi({ name }: { name: string }) {
  return <div>hello {name}</div>;
}

function App() {
  const [count, setCount] = useState<number>(0);
  const containerEl = useRef(null);

  useEffect(() => {
    console.log(count, "count");
  }, []);

  return (
    <div className="App" ref={containerEl}>
      <button type="button">count is: {count}</button>
      <SayHi name={"user"} />
    </div>
  );
}

export default App;
