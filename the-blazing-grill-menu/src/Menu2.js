import { useEffect, useState } from "react";
import { db, storage } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";
import Burger from "./assets/BurgersMenu.jpg";
import pizza2 from "./assets/VegetarianPizza.jpg";
import sanhaImage from "./assets/newSanhaLogo.png";
import Draggable from "react-draggable";
import { MdOutlineCancel } from "react-icons/md";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
function MenuPage2({ state, setState, menu, setMenu, fetchPost, edit }) {
  const PAGE = "menu2";
  const [remove, setRemove] = useState(-1);

  const updateMenu = async (data, index, e) => {
    state[index].data.map((items, i) => {
      const docRef = doc(db, data.name, items.id);
      updateDoc(docRef, items);
    });
    await fetchPost();
  };
  // const fetchPost = async (name) => {
  //   let newDataArr = [];
  //   MenudataSection.map(async (data) => {
  //     await getDocs(collection(db, data.name)).then((querySnapshot) => {
  //       const newData = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         // id: doc.id,
  //       }));
  //       newDataArr.push({ name: data.name, data: newData });
  //       setState(newDataArr);
  //     });
  //   });
  // };
  const mouseOver = (e, i) => {
    console.log(i);
    console.log(state[i]);
    setRemove(i);
    e.currentTarget.style.color = "red";
  };
  const setContent = (data, ui) => {
    const xValue = ui.x;
    const yValue = ui.y;
    console.log(xValue, yValue);
    data.data.forEach((items) => {
      items.positionX = xValue.toString();
      items.positionY = yValue.toString();
      items.page = PAGE;
    });
  };
  const removeItemFromPage = async (data, index) => {
    data.data.forEach((items) => {
      items.positionX = "None";
      items.positionY = "None";
      items.page = deleteField();
    });
    console.log(data);
    state[index].data.map((items, i) => {
      const docRef = doc(db, data.name, items.id);
      updateDoc(docRef, items);
    });
    await fetchPost();
  };
  return state.length > 0 ? (
    <div className="Menu">
      {state.map((items, i) => {
        let positionX = "";
        let positionY = "";
        if (items.data.length > 0 && items.data[0].positionX != undefined) {
          positionX = items.data[0].positionX;
          positionY = items.data[0].positionY;
        }

        return (
          <Draggable
            defaultPosition={{
              x: parseInt(positionX),
              y: parseInt(positionY),
            }}
            style={{ border: "10px solid black" }}
            // onStop={(e, ui) => testing(e, ui)}
            onStop={(e, ui) => setContent(items, ui)}
            disabled={edit === "edit" ? false : true}
          >
            <div
              onDoubleClick={(e) => updateMenu(items, i, e)}
              style={{
                width: "30%",
                height: `${items.data.length * 6.5}%`,
                // backgroundColor: "red",
                margin: "1vh auto",
                cursor: "pointer",
                // border: "1px solid",
              }}
            >
              {console.log(items)}
              <div
                onMouseOver={(e) => mouseOver(e, i)}
                onMouseOut={(e) => {
                  setRemove(-1);
                  // e.currentTarget.style.color = "white";
                }}
                // onDoubleClick={() => console.log(100)}
                className="SectionName"
                style={{ marginTop: "1vh" }}
              >
                {remove >= 0 && i === remove && (
                  <p
                    onClick={() => removeItemFromPage(items, i)}
                    style={{
                      position: "absolute",
                      fontSize: 30,
                      margin: "10px auto",
                      cursor: "pointer",
                    }}
                  >
                    <MdOutlineCancel />
                  </p>
                )}
                <text>{items.name !== undefined && items.name}</text>
              </div>
              {items.data.map((data) => {
                return (
                  <div className="ItemsData">
                    <div className="NameAndPrice">
                      <p className="itemNames">{data.name}</p>
                      <div>
                        <p className="price"> R{data.price}</p>
                      </div>
                    </div>
                    <div className="Information">{data.Information} </div>
                  </div>
                );
              })}
            </div>
          </Draggable>
        );
      })}
      <Draggable
        defaultPosition={{
          x: 1226,
          y: -1,
        }}
      >
        <div
          style={{
            position: "absolute",
            // width: "100%",
            // height: "30%",
            // //   border: "1px solid white",
            // // background: "red",
            // margin: "auto",
          }}
        >
          <img
            style={{ height: "300px" }}
            alt=""
            className="BlazingImage"
            draggable={false}
            src="https://www.theblazinggrill.co.za/wp-content/uploads/2021/07/TBG_Final_TransWhite.png"
          ></img>
          <br></br>
          <text>Menu</text>
        </div>
      </Draggable>
    </div>
  ) : (
    <div></div>
  );
}

export default MenuPage2;
