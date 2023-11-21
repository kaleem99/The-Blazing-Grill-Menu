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

import MenuPage3 from "./Menu3";
function App() {
  const [state, setState] = useState([]);
  const [menu, setMenu] = useState([]);
  const [images, setImages] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  const [zoom, setZoom] = useState(0.8);
  const screenshotRef = useRef(null);
  const [dragElement, setDragElement] = useState(false);
  const [resizeElement, setResizeElement] = useState(false);

  let MenuPage = window.location.href.split("?");
  const PAGE = MenuPage[1] == undefined ? "menu2" : MenuPage[1];
  let newDataArr = [];
  let menuDataArr = [];

  const downloadAsPDF = async (index) => {
    const options = {
      width: 1895, // A4 width in pixels
      height: 1000, // A4 height in pixels
    };

    htmlToImage
      .toPng(screenshotRef.current, options)
      .then(function (dataUrl) {
        // var img = new Image();
        // img.src = dataUrl;
        // document.body.appendChild(img);
        console.log(dataUrl, "Data URL");
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
              // console.log(true);
              menuDataArr.push({
                name: data.name,
                data: newData,
              });
            }
          }
          setState(newDataArr);
          setMenu(menuDataArr);
        }
      );
      data.unsubscribe = unsubscribe;
    });
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
    let data = {};
    const unsubscribe = onSnapshot(
      collection(db, "MenuImages"),
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          // positionX: doc.data().positionX ? doc.data().positionX : "None",
          // positionY: doc.data().positionY ? doc.data().positionY : "None",
          id: doc.id,
        }));
        setPageImages(
          newData.filter((item) => item.page !== "None" && item.page === PAGE)
        );
        const result = newData.filter((item) => item.page === "None");
        setImages(result);
        // getImages(newData);
      }
    );
    data.unsubscribe = unsubscribe;
  };
  useEffect(() => {
    fetchImage();

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
      // console.log(items);
      items.positionX = "0";
      items.positionY = "0";
      items.width = items.width == undefined ? 200 : items.width;
      items.height = items.height == undefined ? 500 : items.height;
      items.page = PAGE;
      updateDoc(docRef, items);
    });
    await fetchPost();
  };
  const updateImages = async (data, index) => {
    const docRef = doc(db, "MenuImages", data.id);
    const newDocument = {
      url: data.url,
      positionX: "0",
      positionY: "0",
      page: PAGE,
      width: 200,
      height: 100,
    };
    await updateDoc(docRef, newDocument);
    await fetchImage();
  };
  const updateMenuItemsAndData = () => {
    try {
      for (let i = 0; i < state.length; i++) {
        console.log(state[i], "Menu");
        state[i].data.forEach((data) => {
          const docRef = doc(db, data.category, data.id);
          console.log(docRef, data);
          updateDoc(docRef, data);
        });
      }
      for (let i = 0; i < pageImages.length; i++) {
        const docRef = doc(db, "MenuImages", pageImages[i].id);
        updateDoc(docRef, pageImages[i]);
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
        />
      ) : (
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
