import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import { useState } from "react";

function App() {
  const [state, setState] = useState([]);
  return (
    <div className="App">
      <Menu state={state} setState={setState} />
    </div>
  );
}

export default App;
