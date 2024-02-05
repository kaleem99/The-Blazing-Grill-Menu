import { db } from "../database/config";
import { collection, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import databaseNames from "../database/databaseNames";
import { useState, useEffect } from "react";
import MenuItemsSection from "./menuSections";
const MainPopup = ({ setStoreState, storeState, setId, id }) => {
  const [data, setData] = useState([]); // Initialize state for storing data
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

  const setDataFunct = (store) => {
    let keyName = Object.keys(store)[0];
    let idName = Object.keys(store)[1];
    setId(store[idName]);
    setStoreState(store[keyName]);
    console.log(store[idName], "storeState");
    console.log(store, "storeState");
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
      window.location.href += "?menu1?edit";
    }, 1000);
  };
  return (
    <div className="MainPopup">
      <h2>Please select a store</h2>
      <select
        onChange={(event) =>
          setDataFunct(
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
