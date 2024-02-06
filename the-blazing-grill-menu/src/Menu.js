import { useEffect, useState } from "react";
import { db, storage } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";
import pizzas from "./assets/Pizzas.jpg";
import pizza2 from "./assets/VegetarianPizza.jpg";
import sanhaImage from "./assets/newSanhaLogo.png";
import Draggable from "react-draggable";
import { MdOutlineCancel } from "react-icons/md";
import { Resizable } from "re-resizable";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
function Menu({
  state,
  setState,
  menu,
  setMenu,
  fetchPost,
  edit,
  images,
  fetchImage,
  reference,
  zoom,
  dragElement,
  resizeElement,
  allItems,
  id,
  storeState,
  setStoreState,
}) {
  const PAGE = "menu1";
  const [body, setBody] = useState(images);
  const [remove, setRemove] = useState(-1);
  const updateMenu = async (data, index, e) => {
    state[index].data.map((items, i) => {
      const docRef = doc(db, data.name, items.id);
      console.log(items, "ITEMS", data, items);
      updateDoc(docRef, items);
    });
    await fetchPost();
  };
  const updateImage = async (item, index, e) => {
    // const item = images[index];
    const docRef = doc(db, "MenuImages", item.id);
    updateDoc(docRef, item);
  };
  const mouseOver = (e, i) => {
    setRemove(i);
    e.currentTarget.style.color = "red";
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

  const setContent = (data, ui) => {
    const xValue = ui.x;
    const yValue = ui.y;
    // data..forEach((items) => {
    data.positionX = xValue.toString();
    data.positionY = yValue.toString();
    data.page = PAGE;
  };
  const setImage = (item, ui) => {
    const xValue = ui.x;
    const yValue = ui.y;
    // data.data.forEach((items) => {
    item.positionX = xValue.toString();
    item.positionY = yValue.toString();
    item.page = PAGE;
    // });
  };
  const removeItemFromPage = async (data, index) => {
    data.positionX = "None";
    data.positionY = "None";
    data.page = "None";
    // state[index].data.map((items, i) => {
    const docRef = doc(db, "BlazingStores", id);
    const result = {};

    storeState.menuImages[index] = data;
    result[storeState.store] = storeState;
    localStorage.setItem("storeData", JSON.stringify(storeState));

    updateDoc(docRef, result);
    await fetchPost();
  };
  const removeImageFromPage = async (data, index) => {
   data.positionX = "None";
    data.positionY = "None";
    const docRef = doc(db, "BlazingStores", id);
    data.page = "None";
    // setStoreState(storeState);
    const result = {};
    for (let i = 0; i < storeState.menuImages.length; i++) {
      if (storeState.menuImages[i].id === data.id) {
        storeState.menuImages[i] = data;
        break;
      }
    }
    result[storeState.store] = storeState;
    localStorage.setItem("storeData", JSON.stringify(storeState));

    updateDoc(docRef, result);
    await fetchImage();
  };
  const onResize = (event, { node, size, handle }) => {
    setBody({ height: size.height, width: size.width });
    // this.setState({ width: size.width, height: size.height });
  };
  console.log(state, "STATE");
  return state.length > 0 || images.length > 0 ? (
    <div
      className="Menu"
      ref={reference}
      style={
        edit === "edit"
          ? { zoom: zoom, border: "3px solid white" }
          : { zoom: zoom }
      }
    >
      {state.map((items, i) => {
        let positionX = "";
        let positionY = "";
        if (items.positionX != undefined) {
          positionX = items.positionX;
          positionY = items.positionY;
        }
        console.log(items);
        return (
          <Draggable
            defaultPosition={{
              x: parseInt(positionX),
              y: parseInt(positionY),
            }}
            style={{ border: "10px solid black" }}
            // onStop={(e, ui) => testing(e, ui)}
            onStop={(e, ui) => setContent(items, ui)}
            disabled={!dragElement ? true : false}
          >
            <Resizable
              size={{
                width: items.width,
                // height: allItems.left * ,
              }}
              enable={{
                top: resizeElement,
                right: resizeElement,
                bottom: resizeElement,
                left: resizeElement,
                topRight: resizeElement,
                bottomRight: resizeElement,
                bottomLeft: resizeElement,
                topLeft: resizeElement,
              }}
              onResizeStop={(e, direction, ref, d) => {
                const bodyArr = [...state];
                const newItem = items;
                // newItem.forEach((data) => {
                newItem.width = newItem.width + d.width;
                newItem.height = newItem.height + d.height;
                // });

                bodyArr[i] = newItem;
                setState(bodyArr);
                // setBody({
                //   width: body.width + d.width,
                //   height: body.height + d.height,
                // });
              }}
              style={{
                position: "absolute",
                // border: "2px double white",
                border: edit === "edit" ? "2px solid white" : "",
              }}
            >
              <div
                // onDoubleClick={(e) => updateMenu(items, i, e)}
                style={{
                  width: items.width,
                  // flex: "0 0 calc(33.33% - 10px)",
                  // maxWidth: "calc(33.33% - 10px)",
                  // height: `${allItems.length * 6.5}%`,
                  // backgroundColor: "red",
                  margin: "1vh auto",
                  // border: "1px solid",
                  cursor: "pointer",
                }}
              >
                <div
                  onMouseOver={(e) => edit === "edit" && mouseOver(e, i)}
                  onMouseOut={(e) => {
                    setRemove(-1);
                    // e.currentTarget.style.color = "white";
                  }}
                  // MdOutlineCancel
                  // onDoubleClick={() => console.log(100)}
                  className="SectionName"
                  style={{ marginTop: "-1vh", height: "60px" }}
                >
                  {edit === "edit" && remove >= 0 && i === remove && (
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
                  {console.log(items.name, "JHGH")}
                  <text>{items.name !== undefined && items.name}</text>
                </div>
                <div className="itemContainer">
                  {console.log(allItems, "ALLITEMS")}
                  {allItems
                    .filter((data) => data.category === items.name)
                    .map((data) => {
                      return (
                        <div
                          className="ItemsData"
                          style={{
                            width: items.width > 650 ? "50%" : "100%",
                          }}
                        >
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
              </div>
            </Resizable>
          </Draggable>
        );
      })}

      {images.map((item, i) => {
        return (
          <Draggable
            defaultPosition={{
              x: parseInt(item.positionX),
              y: parseInt(item.positionY),
            }}
            // style={{ border: "10px solid black" }}
            // onStop={(e, ui) => testing(e, ui)}
            onStop={(e, ui) => setImage(item, ui)}
            disabled={!dragElement ? true : false}
          >
            <Resizable
              size={{ width: item.width, height: item.height }}
              onResizeStop={(e, direction, ref, d) => {
                const bodyArr = [...body];
                const newItem = item;
                newItem.width = newItem.width + d.width;
                newItem.height = newItem.height + d.height;
                bodyArr[i] = newItem;
                setBody(bodyArr);
                // setBody({
                //   width: body.width + d.width,
                //   height: body.height + d.height,
                // });
              }}
              enable={{
                top: resizeElement,
                right: resizeElement,
                bottom: resizeElement,
                left: resizeElement,
                topRight: resizeElement,
                bottomRight: resizeElement,
                bottomLeft: resizeElement,
                topLeft: resizeElement,
              }}
              style={{
                position: "absolute",
                // border: "2px double white",
                border: edit === "edit" ? "2px solid white" : "",
              }}
            >
              <div
                // onDoubleClick={(e) => updateImage(item, i, e)}
                onMouseOver={(e) => mouseOver(e, i)}
                onMouseOut={(e) => {
                  setRemove(-1);
                  // e.currentTarget.style.color = "white";
                }}
                style={{
                  position: "absolute",
                  // cursor: "pointer",
                  height: item.height,
                  width: item.width,
                  // border: "1px solid white",
                  // // background: "red",
                  // margin: "auto",
                }}
              >
                {edit === "edit" && remove >= 0 && i === remove && (
                  <p
                    onClick={() => removeImageFromPage(item, i)}
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
                <img
                  alt=""
                  style={{
                    height: item.height - 10,
                    width: item.width - 10,
                  }}
                  src={item.url}
                  draggable={false}
                ></img>
              </div>
            </Resizable>
          </Draggable>
        );
      })}
      {/* <Resizable
        size={{ width: body.width, height: body.height }}
        // onResizeStop={(e, direction, ref, d) => {
        //   setBody({
        //     width: body.width + d.width,
        //     height: body.height + d.height,
        //   });
        // }}
        style={{ position: "absolute", border: "1px solid white" }}
        // draggableOpts={{ enableUserSelectHack: false }}
      >
        <div
          style={{
            width: `${body.width}px`,
            height: `${body.height}px`,
            // border: "1px solid #ccc",
            // padding: "10px",
            // position: "absolute",
          }}
        >
          Resizable Div
        </div>
      </Resizable> */}
    </div>
  ) : (
    <div></div>
  );
}

export default Menu;
