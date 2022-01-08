/* @jsx createElement */
import { createElement } from "../../src/create-element";

import App from "./App";
import { render } from "../../src/render";

render(document.getElementById("root") as HTMLElement, <App />);
