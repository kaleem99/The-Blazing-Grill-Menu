import { useEffect, useState } from "react";
import { db, storage } from "../database/config";
import Draggable from "react-draggable";
import { MdOutlineCancel } from "react-icons/md";
import { Resizable } from "re-resizable";
import { updateDoc, doc } from "firebase/firestore";
function MenuPage3({
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
  PAGE,
}) {
  const [remove, setRemove] = useState(-1);
  const [body, setBody] = useState(images);

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
    setRemove(i);
    e.currentTarget.style.color = "red";
  };
  const setContent = (data, ui) => {
    const xValue = ui.x;
    const yValue = ui.y;
    console.log(xValue, yValue, data);
    // data..forEach((items) => {
    data.positionX = xValue.toString();
    data.positionY = yValue.toString();
    data.page = PAGE;
    // });
  };
  const setImage = (item, ui) => {
    const xValue = ui.x;
    const yValue = ui.y;
    // console.log(xValue, yValue);
    // data.data.forEach((items) => {
    item.positionX = xValue.toString();
    item.positionY = yValue.toString();
    item.page = PAGE;
    console.log(item, 88);
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
      if (storeState.menuImages[i].url === data.url) {
        storeState.menuImages[i] = data;
        break;
      }
    }
    result[storeState.store] = storeState;
    localStorage.setItem("storeData", JSON.stringify(storeState));

    updateDoc(docRef, result);
    await fetchImage();
  };
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
                // height: items.height,
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
                border: edit === "edit" ? "2px solid white" : "",
                // border: "2px double white",
              }}
            >
              <div
                // onDoubleClick={(e) => updateMenu(items, i, e)}
                style={{
                  // width: "30%",
                  height: `${items.length * 6.5}%`,
                  // backgroundColor: "red",
                  margin: "1vh auto",
                  cursor: "pointer",
                  // border: "1px solid",
                }}
              >
                <div
                  onMouseOver={(e) => mouseOver(e, i)}
                  onMouseOut={(e) => {
                    setRemove(-1);
                    // e.currentTarget.style.color = "white";
                  }}
                  // onDoubleClick={() => console.log(100)}
                  className="SectionName"
                  style={{ marginTop: "-1vh" }}
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
                  <text>{items.name !== undefined && items.name}</text>
                </div>
                <div className="itemContainer">
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
    </div>
  ) : (
    <div></div>
  );
}

export default MenuPage3;
