// import logo from "./logo.svg";
import "./App.css";
// import Menu from "./Menu";
// import MenuPage2 from "./Menu2";
import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { db } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";
import { storage } from "./database/config";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
} from "firebase/firestore";
// import { getDownloadURL, ref, listAll } from "firebase/storage";
import {
  MdOutlineScreenshot,
  MdBackHand,
  MdFormatShapes,
} from "react-icons/md";
import { IoMdSave } from "react-icons/io";

import * as htmlToImage from "html-to-image";

import MainPopup from "./frontend/MainPopup";
import MenuPage3 from "./Menu3";
function App() {
  const [state, setState] = useState([]);
  const [menu, setMenu] = useState([]);
  const [images, setImages] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  const [zoom, setZoom] = useState(0.8);
  const [menuPages, setMenuPages] = useState([]);
  const screenshotRef = useRef(null);
  const [dragElement, setDragElement] = useState(false);
  const [resizeElement, setResizeElement] = useState(false);
  // Break
  const [storeState, setStoreState] = useState(null);
  const [id, setId] = useState("");

  const [allItems, setAllItems] = useState([]);
  let MenuPage = window.location.href.split("?");
  const PAGE = MenuPage[1] == undefined ? "" : MenuPage[1];
  let newDataArr = [];
  let menuDataArr = [];

  const downloadAsPDF = async (index) => {
    const options = {
      width: 1895, // A4 width in pixels
      // height: 1000, // A4 height in pixels
    };
    const node = screenshotRef.current;
    htmlToImage
      .toPng(node, options)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = "theblazinggrillmenu.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };
  const fetchPost = async () => {
    // if (storeState === null) {
    newDataArr = [];
    menuDataArr = [];
    let localStoreData = JSON.parse(localStorage.getItem("storeData"));
    let localStoreId = localStorage.getItem("storeId");
    setStoreState(localStoreData);
    localStoreData.menuItems.map((data) => {
      if (data.page === PAGE && data.positionX !== "None") {
        newDataArr.push(data);
      } else {
        if (data.page === "None") {
          menuDataArr.push(data);
          // console.log(data);
        }
      }
   
    });
    // }

    setId(localStoreId);
    setState(newDataArr);
    setMenu(menuDataArr);
    let ItemsDataArr = JSON.parse(localStorage.getItem("ITEMS"));
    setAllItems(ItemsDataArr);
  };
  const fetchImage = async () => {
    let localStoreData = JSON.parse(localStorage.getItem("storeData"));
    let newImageArr = [];
    let imageArr = [];
    setStoreState(localStoreData);
    localStoreData.menuImages.map((data) => {
      if (data.page === PAGE && data.positionX !== "None") {
        newImageArr.push(data);
      } else {
        if (data.page === "None") {
          imageArr.push(data);
        }
      }
    });
    setPageImages(newImageArr);
    setImages(imageArr);
  };
  useEffect(() => {
    onSnapshot(collection(db, "MenuPages"), (querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))[0];
      setMenuPages(newData);
      setZoom(parseInt(newData[PAGE]) / 100);
    });
    fetchPost();
    fetchImage();
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
    const docRef = doc(db, "BlazingStores", id);
    data.positionX = "100";
    data.positionY = "100";
    data.width = data.width == undefined ? 200 : data.width;
    data.height = data.height == undefined ? 500 : data.height;
    data.page = PAGE;
    const result = {};
    result[storeState.store] = storeState;
    localStorage.setItem("storeData", JSON.stringify(storeState));

    updateDoc(docRef, result);
    // });
    await fetchPost();
  };
  const updateImages = async (data, index) => {
    const docRef = doc(db, "BlazingStores", id);

    data.positionX = "0";
    data.positionY = "0";
    data.page = PAGE;
    data.width = 300;
    data.height = 200;
    const result = {};
    for (let i = 0; i < storeState.menuImages.length; i++) {
      if (storeState.menuImages[i].url === data.url) {
        storeState.menuImages[i] = data;
        break;
      }
    }
    result[storeState.store] = storeState;
    console.log(100, storeState.menuImages, data);
    localStorage.setItem("storeData", JSON.stringify(storeState));

    await updateDoc(docRef, result);
    await fetchImage();
  };
  const updateMenuItemsAndData = async () => {
    for (let i = 0; i < storeState.menuItems.length; i++) {
      for (let j = 0; j < state.length; j++) {
        if (storeState.menuItems[i].name === state[j].name) {
          storeState.menuItems[i] = state[j];
        }
      }
    }
    // pageImages
    for (let i = 0; i < storeState.menuImages.length; i++) {
      for (let j = 0; j < pageImages.length; j++) {
        if (storeState.menuImages[i].url === pageImages[j].url) {
          storeState.menuImages[i] = pageImages[j];
        }
      }
    }

    try {
      const docRef = doc(db, "BlazingStores", id);
      const result = {};
      result[storeState.store] = storeState;

      localStorage.setItem("storeData", JSON.stringify(storeState));

      await updateDoc(docRef, result);
      let MenueDocRef = doc(db, "MenuPages", menuPages.id);
      const newMenuPage = {
        ...menuPages,
        [PAGE]: parseInt(zoom * 100).toString(),
      };
      await updateDoc(MenueDocRef, newMenuPage);
      alert("Menu items have been updated successfully");
    } catch (err) {
      alert(err + " Please try again later");
      console.log(err);
    }
    setDragElement(false);
    setResizeElement(false);
  };
  return (
    <div className="App">
      {MenuPage[2] === "edit" && (
        <Draggable>
          <div className="sideBar">
            <button
              className="react-icon"
              onClick={() => updateMenuItemsAndData()}
            >
              <IoMdSave />
            </button>
            <button className="react-icon" onClick={() => downloadAsPDF(0)}>
              <MdOutlineScreenshot />
            </button>
            <button
              className="react-icon"
              onClick={() => zoom <= 0.9 && setZoom(zoom + 0.1)}
            >
              +
            </button>
            <button
              className="react-icon"
              onClick={() => zoom > 0.1 && setZoom(zoom - 0.1)}
            >
              -
            </button>
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

      {PAGE === "menu1" || PAGE === "menu2" || PAGE === "menu3" ? (
        <MenuPage3
          fetchPost={fetchPost}
          menu={menu}
          setMenu={setMenu}
          state={state}
          setState={setState}
          edit={MenuPage[2]}
          images={pageImages}
          fetchImage={fetchImage}
          reference={screenshotRef}
          zoom={zoom}
          dragElement={dragElement}
          resizeElement={resizeElement}
          allItems={allItems}
          id={id}
          storeState={storeState}
          setStoreState={setStoreState}
          PAGE={PAGE}
        />
      ) : (
        <MainPopup
          setStoreState={setStoreState}
          storeState={storeState}
          setId={setId}
          id={id}
          fetchImage={fetchImage}
        />
      )}
      {MenuPage[2] === "edit" && (
        <Draggable>
          <div className="sideBar">
            <button style={{ fontSize: "large" }} className="react-icon">
              {(zoom * 100).toFixed(0)}%
            </button>
            <button
              style={dragElement ? { color: "orange" } : {}}
              className="react-icon"
              onClick={() => {
                setDragElement(!dragElement);
                setResizeElement(false);
              }}
            >
              <MdBackHand />
            </button>
            <button
              style={resizeElement ? { color: "orange" } : {}}
              className="react-icon"
              onClick={() => {
                setResizeElement(!resizeElement);
                setDragElement(false);
              }}
            >
              <MdFormatShapes />
            </button>
            {images.map((data, i) => (
              <div
                onDoubleClick={() => updateImages(data, i)}
                className="menuItemIcon"
              >
                <img
                  style={{ objectFit: "contain" }}
                  width={"90%"}
                  height={"90%"}
                  alt=""
                  src={data.url}
                ></img>
              </div>
            ))}
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default App;
