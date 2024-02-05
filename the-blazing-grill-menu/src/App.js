import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import MenuPage2 from "./Menu2";
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
import { getDownloadURL, ref, listAll } from "firebase/storage";
import {
  MdOutlineScreenshot,
  MdBackHand,
  MdFormatShapes,
} from "react-icons/md";
import { IoMdSave } from "react-icons/io";

import * as htmlToImage from "html-to-image";

// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
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

    // Set the width and height of the container to ensure 100% coverage
    // node.style.width = '100vw';
    // node.style.height = '100vh';

    htmlToImage
      .toPng(node, options)
      .then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // document.body.appendChild(img);
        // console.log(dataUrl, "Data URL");
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
          console.log(data);
        }
      }
      // setState(newDataArr);
      // setMenu(menuDataArr);
    });
    // }

    console.log(storeState, "localStoreId");
    setId(localStoreId);
    setState(newDataArr);
    setMenu(menuDataArr);
    // console.log(storeState);
    let ItemsDataArr = JSON.parse(localStorage.getItem("ITEMS"));
    setAllItems(ItemsDataArr);
    // MenuItemsSection.map((data) => {
    //   const unsubscribe = onSnapshot(
    //     collection(db, data.name),
    //     (querySnapshot) => {
    //       const newData = querySnapshot.docs.map((doc) => ({
    //         ...doc.data(),
    //         positionX: doc.data().positionX ? doc.data().positionX : "None",
    //         positionY: doc.data().positionY ? doc.data().positionY : "None",
    //         id: doc.id,
    //       }));
    //       // console.log(newData);
    //       if (
    //         newData.filter((data) => data.page === PAGE).length > 0 &&
    //         newData[0].positionX !== "None"
    //       ) {
    //         newDataArr.push({
    //           name: data.name,
    //           data: newData,
    //         });
    //       } else {
    //         let keys = [];
    //         if (newData.length > 0) {
    //           keys = Object.keys(newData[0]);
    //         }
    //         if (keys.length > 0 && !keys.includes("page")) {
    //           // console.log(true);
    //           menuDataArr.push({
    //             name: data.name,
    //             data: newData,
    //           });
    //         }
    //       }
    //       // setState(newDataArr);
    //       // setMenu(menuDataArr);
    //       console.log(newDataArr, "Hello", menuDataArr);
    //     }
    //   );
    //   data.unsubscribe = unsubscribe;
    // });
  };
  // const getImages = async (newData) => {
  //   const reference = ref(storage, "/images");
  //   listAll(reference)
  //     .then((result) => {
  //       const promises = result.items.map(async (item) => {
  //         const url = await getDownloadURL(item);
  //         return url;
  //       });
  //       return Promise.all(promises);
  //     })
  //     .then((urls) => {
  //       // console.log(urls, "URLS");
  //       const filteredURL = urls.filter((url) => {
  //         return newData.some((image) => image.url !== url);
  //       });
  //       console.log(filteredURL, "Hello World");
  //       console.log(newData);
  //       setImages(filteredURL);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching images:", error);
  //     });
  // };
  const fetchImage = async () => {
    let localStoreData = JSON.parse(localStorage.getItem("storeData"));
    // const newData = localStoreData.menuImages;
    //     console.log(newData, 179);

    let newImageArr = [];
    let imageArr = [];

    // let localStoreId = localStorage.getItem("storeId");
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
    const unsubscribe = onSnapshot(
      collection(db, "MenuPages"),
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0];
        setMenuPages(newData);
        setZoom(parseInt(newData[PAGE]) / 100);
      }
    );
    fetchPost();
    fetchImage();

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
    console.log(menu, 219);
    console.log(data, 220);
    // menu[index].data.map((items, i) => {
    const docRef = doc(db, "BlazingStores", id);
    console.log(docRef);
    data.positionX = "100";
    data.positionY = "100";
    data.width = data.width == undefined ? 200 : data.width;
    data.height = data.height == undefined ? 500 : data.height;
    data.page = PAGE;
    // menu[index] = data;
    // storeState.menuItems = menu;
    const result = {};
    result[storeState.store] = storeState;
    console.log(result, 232);
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
    storeState.menuImages[index] = data;
    result[storeState.store] = storeState;
    console.log(100, storeState.menuImages, data);
    localStorage.setItem("storeData", JSON.stringify(storeState));

    await updateDoc(docRef, result);
    await fetchImage();
  };
  const updateMenuItemsAndData = async () => {
    console.log(state, "STATE");
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
        if (storeState.menuImages[i].id === pageImages[j].id) {
          storeState.menuImages[i] = pageImages[j];
        }
      }
    }

    try {
      // for (let i = 0; i < state.length; i++) {
      //   state[i].data.forEach(async (data) => {
      //     //BlazingStores
      //   });
      // }
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

      for (let i = 0; i < pageImages.length; i++) {
        const docRef = doc(db, "MenuImages", pageImages[i].id);
        await updateDoc(docRef, pageImages[i]);
        console.log(pageImages[i]);
      }

      alert("Menu items have been updated successfully");
    } catch (err) {
      alert(err, "Please try again later");
    }
    setDragElement(false);
    setResizeElement(false);
  };
  return (
    <div className="App">
      {MenuPage[2] === "edit" && (
        <Draggable>
          <div className="sideBar">
            {/* {console.log(menu)} */}
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

      {PAGE === "menu1" ? (
        <Menu
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
        />
      ) : PAGE === "menu2" ? (
        <MenuPage2
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
        />
      ) : PAGE === "menu3" ? (
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
        />
      ) : (
        <MainPopup
          setStoreState={setStoreState}
          storeState={storeState}
          setId={setId}
          id={id}
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
