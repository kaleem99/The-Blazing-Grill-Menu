import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import MenuPage2 from "./Menu2";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { db } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";

import { doc, updateDoc, onSnapshot, collection } from "firebase/firestore";
function App() {
  const [state, setState] = useState([]);
  const [menu, setMenu] = useState([]);
  let MenuPage = window.location.href.split("?");
  const PAGE = MenuPage[1] == undefined ? "menu2" : MenuPage[1];
  console.log(MenuPage[1]);
  let newDataArr = [];
  let menuDataArr = [];
  const fetchPost = async () => {
    MenuItemsSection.map((data) => {
      const unsubscribe = onSnapshot(
        collection(db, data.name),
        (querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            positionX: doc.data().positionX ? doc.data().positionX : "None",
            positionY: doc.data().positionY ? doc.data().positionY : "None",
            id: doc.id,
          }));
          if (
            newData.filter((data) => data.page === PAGE).length > 0 &&
            newData[0].positionX !== "None"
          ) {
            newDataArr.push({
              name: data.name,
              data: newData,
            });
          } else {
            let keys = [];
            if (newData.length > 0) {
              keys = Object.keys(newData[0]);
            }
            if (keys.length > 0 && !keys.includes("page")) {
              console.log(true);
              menuDataArr.push({
                name: data.name,
                data: newData,
              });
            }
            // if (!Object.keys(newData[0]).includes("page")) {

            // }

            // console.log(newData);
            console.log(newData);
          }
          setState(newDataArr);
          setMenu(menuDataArr);
        }
      );

      // Store the unsubscribe function to clean up the listener later
      data.unsubscribe = unsubscribe;
    });
  };

  useEffect(() => {
    fetchPost();
    // Clean up the listeners when the component unmounts
    return () => {
      MenuItemsSection.forEach((data) => {
        if (data.unsubscribe) {
          data.unsubscribe();
          delete data.unsubscribe;
        }
      });
    };
  }, []);
  const updateData = async (data, index) => {
    menu[index].data.map((items, i) => {
      const docRef = doc(db, data.name, items.id);
      console.log(items);
      items.positionX = "0";
      items.positionY = "0";
      items.page = PAGE;
      updateDoc(docRef, items);
    });
    await fetchPost();
  };

  return (
    <div className="App">
      {MenuPage[2] === "edit" && (
        <Draggable>
          <div className="sideBar">
            {console.log(menu)}

            {menu.map((data, i) => (
              <div
                onDoubleClick={() => updateData(data, i)}
                className="menuItemIcon"
              >
                {data.name}
              </div>
            ))}
          </div>
        </Draggable>
      )}
      {PAGE === "menu1" ? (
        <Menu
          fetchPost={fetchPost}
          menu={menu}
          setMenu={setMenu}
          state={state}
          setState={setState}
        />
      ) : (
        <MenuPage2
          fetchPost={fetchPost}
          menu={menu}
          setMenu={setMenu}
          state={state}
          setState={setState}
        />
      )}
    </div>
  );
}

export default App;
