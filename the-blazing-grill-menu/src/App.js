import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import MenuPage2 from "./Menu2";
import { useState } from "react";

function App() {
  const [state, setState] = useState([]);
  const MenuPage = window.location.href.split("?");
  console.log(MenuPage);
  return (
    <div className="App">
      {MenuPage[1] === "menu1" ? (
        <Menu state={state} setState={setState} />
      ) : (
        <MenuPage2 state={state} setState={setState} />
      )}
    </div>
  );
}

export default App;
