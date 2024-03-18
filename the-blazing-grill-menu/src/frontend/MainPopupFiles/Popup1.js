import { db } from "../../database/config";
import { collection, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import databaseNames from "../../database/databaseNames";
import MenuItemsSection from "../menuSections";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  UPDATE_STORE_STATE,
  UPDATE_ID_STATE,
  otherOptions,
  menuOptions,
} from "../../redux/constants";
import MappedOptions from "../../Helpers.js/displayMappedOptions";
const Popup1 = ({ data, store, setStore }) => {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(null);
  const [mode, setMode] = useState(null);

  const setDataFunct = async () => {
    if (store === null || menu === null || mode === null) {
      return alert("Please select ensure to select all options.");
    }
    let newMode = `?${mode.name.toLowerCase()}`;
    if (mode.name.toLowerCase() === "view") {
      newMode = "";
    }
    let keyName = Object.keys(store)[0];
    let idName = Object.keys(store)[1];
    dispatch({ type: UPDATE_ID_STATE, payload: store[idName] });
    dispatch({ type: UPDATE_STORE_STATE, payload: store[keyName] });
    console.log(store[keyName]);
    await localStorage.setItem("storeData", JSON.stringify(store[keyName]));
    await localStorage.setItem("storeId", store[idName]);
    let result = [];
    await MenuItemsSection.map(async (data) => {
      const unsubscribe = await onSnapshot(
        collection(db, data.name),
        async (querySnapshot) => {
          const newData = await querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          result.push(...newData);
        }
      );

      data.unsubscribe = unsubscribe;
    });

    setTimeout(() => {
      localStorage.setItem("ITEMS", JSON.stringify(result));
      window.location.href += "?" + menu.name.toLowerCase() + newMode;
    }, 2000);
  };
  return (
    <div className="MainPopup">
      <h1>Please select a store</h1>
      <select
        className="selectMenu"
        onChange={(event) => {
          setStore(
            data.find((store) => Object.keys(store)[0] === event.target.value)
          );
        }}
      >
        <option value={"None"}>None</option>
        {data.map((store, index) => {
          let keyName = Object.keys(store)[0];
          // let idName = Object.keys(store)[1];
          return (
            <option key={index} value={keyName}>
              {keyName}
            </option>
          );
        })}
      </select>
      <h2>Select a menu</h2>
      <div className="menuAndEditViewOptions">
        <MappedOptions
          optionsData={menuOptions}
          menu={menu}
          setMenu={setMenu}
        />
        {/* {menuOptions.map((opt) => (
          <div
            style={
              menu !== null && menu.name === opt.name
                ? { color: "#f7941d" }
                : {}
            }
            onClick={(e) => setMenu({ ...opt, selected: true })}
            className="menuAndEditViewOptionsItem"
          >
            {opt.name}
          </div>
        ))} */}
      </div>
      <h2>Select a mode</h2>

      <div style={{ width: "50%" }} className="menuAndEditViewOptions">
        <MappedOptions
          optionsData={otherOptions}
          menu={mode}
          setMenu={setMode}
        />
        {/* {otherOptions.map((opt) => (
          <div
            style={
              mode !== null && mode.name === opt.name
                ? { color: "#f7941d" }
                : {}
            }
            className="menuAndEditViewOptionsItem"
            onClick={(e) => setMode({ ...opt, selected: true })}
          >
            {opt.name}
          </div>
        ))} */}
      </div>
      <button onClick={() => setDataFunct()} className="EnterButton">
        Enter
      </button>
    </div>
  );
};

export default Popup1;
