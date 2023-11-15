import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import MenuPage2 from "./Menu2";
import { useState, useEffect } from "react";
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
function App() {
  const [state, setState] = useState([]);
  const [menu, setMenu] = useState([]);
  const [images, setImages] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  let MenuPage = window.location.href.split("?");
  const PAGE = MenuPage[1] == undefined ? "menu2" : MenuPage[1];
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
        console.log(newData);
        setPageImages(
          newData.filter((item) => item.page !== "None" && item.page === PAGE)
        );
        const result = newData.filter((item) => item.page === "None");
        console.log(result);
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
  return (
    <div className="App">
      {MenuPage[2] === "edit" && (
        <Draggable>
          <div className="sideBar">
            {/* {console.log(menu)} */}

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
        />
      ) : (
        <MenuPage2
          fetchPost={fetchPost}
          menu={menu}
          setMenu={setMenu}
          state={state}
          setState={setState}
          edit={MenuPage[2]}
        />
      )}
      {MenuPage[2] === "edit" && (
        <Draggable>
          <div className="sideBar">
            {/* {console.log(menu)} */}

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
