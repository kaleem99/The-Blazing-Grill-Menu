import { db } from "../database/config";
import { collection, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import databaseNames from "../database/databaseNames";
import { useState, useEffect } from "react";
import MenuItemsSection from "./menuSections";
const MainPopup = ({ setStoreState, storeState, setId, id }) => {
  const menuOptions = [
    { name: "Menu1", selected: false },
    { name: "Menu2", selected: false },
    { name: "Menu3", selected: false },
  ];
  const otherOptions = [
    { name: "Edit", selected: false },
    { name: "View", selected: false },
  ];
  const [data, setData] = useState([]); // Initialize state for storing data
  const [store, setStore] = useState(null);
  const [menu, setMenu] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, databaseNames[0]),
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredData = newData.filter((data) => {
          let keyName = Object.keys(data)[0];
          //   console.log(keyName);
          if (keyName !== "admin") {
            return data;
          }
        });
        // console.log(filteredData);
        setData(filteredData); // Update the state with the new data
      }
    );
    return () => {
      // Cleanup function to unsubscribe when the component is unmounted
      unsubscribe();
    };
  }, []);

  const setDataFunct = () => {
    if (store === null || menu === null || mode === null) {
      return alert("Please select ensure to select all options.");
    }
    let newMode = `?${mode.name.toLowerCase()}`;
    if (mode.name.toLowerCase() === "view") {
      newMode = "";
    }
    let keyName = Object.keys(store)[0];
    let idName = Object.keys(store)[1];
    setId(store[idName]);
    setStoreState(store[keyName]);
    localStorage.setItem("storeData", JSON.stringify(store[keyName]));
    localStorage.setItem("storeId", store[idName]);
    let result = [];
    MenuItemsSection.map(async (data) => {
      const unsubscribe = await onSnapshot(
        collection(db, data.name),
        async (querySnapshot) => {
          const newData = await querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            // positionX: doc.data().positionX ? doc.data().positionX : "None",
            // positionY: doc.data().positionY ? doc.data().positionY : "None",
            id: doc.id,
          }));
          console.log(newData);
          result.push(...newData);
        }
      );

      data.unsubscribe = unsubscribe;
    });

    setTimeout(() => {
      localStorage.setItem("ITEMS", JSON.stringify(result));
      window.location.href += "?" + menu.name.toLowerCase() + newMode;
      //   "?menu1?edit";
    }, 1000);
  };
  return (
    <div className="MainPopup">
      <h1>Please select a store</h1>
      <select
        className="selectMenu"
        onChange={(event) =>
          setStore(
            data.find((store) => Object.keys(store)[0] === event.target.value)
          )
        }
      >
        <option value={"None"}>None</option>
        {data.map((store, index) => {
          let keyName = Object.keys(store)[0];
          let idName = Object.keys(store)[1];
          return (
            <option key={index} value={keyName}>
              {keyName}
            </option>
          );
        })}
      </select>
      <h2>Select a menu</h2>
      <div className="menuAndEditViewOptions">
        {menuOptions.map((opt) => (
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
        ))}
      </div>
      <h2>Select a mode</h2>

      <div style={{ width: "50%" }} className="menuAndEditViewOptions">
        {otherOptions.map((opt) => (
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
        ))}
      </div>
      <button onClick={() => setDataFunct()} className="EnterButton">
        Enter
      </button>
    </div>
  );
};
export default MainPopup;

//  I would like to find out which project codes i should use for CCA projects when logging time.
// awesome could you please send me when you have time the project MMID and type for CCA edio v2 CCALMS2-27975

// [
//   "Burgers",
//   "Gourmet Burgers",
//   "Grilled Chicken",
//   "Fries",
//   "Chicken Wings",
//   "On A Roll",
//   "Pizzas",
//   "Specials",
//   "Sauces",
//   "Drinks",
//   "Air Fryer Pizza",
//   "Grills",
//   "Extras",
// ];
