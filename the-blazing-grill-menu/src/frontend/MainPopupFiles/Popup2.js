import { db, storage } from "../../database/config";
import {
  collection,
  onSnapshot,
  getDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import databaseNames from "../../database/databaseNames";
import MenuItemsSection from "../menuSections";
import { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const Popup2 = ({
  setStoreState,
  storeState,
  setId,
  id,
  data,
  setData,
  store,
  setStore,
  fetchImage,
}) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, "files"); // Replace 'images' with your storage path

        // List all items in the images folder
        const imageList = await listAll(imagesRef);

        // Get download URLs for all images
        const urls = await Promise.all(
          imageList.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return url;
          })
        );

        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);
  const imageOnClickEvent = (url, index) => {
    if (selectedImages.includes(url)) {
      const newArr = [...selectedImages].filter((img) => img !== url);
      setSelectedImages(newArr);
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };
  const addImagesToStore = async () => {
    if (store === null) {
      return alert("Please select a store.");
    }
    // const resultObj = {
    //   height: "100",
    //   width: "200",
    //   positionX: "None",
    //   positionY: "None",
    //   page: "None",
    // };
    const resultArr = [];
    for (let i = 0; i < selectedImages.length; i++) {
      const resultObj = {
        height: "100",
        width: "200",
        positionX: "None",
        positionY: "None",
        page: "None",
        url: selectedImages[i],
      };
      resultArr.push(resultObj);
    }
    // console.log(selectedImages, 76)
    const result = {};
    const storeName = Object.keys(store)[0];
    const idName = Object.keys(store)[1];
    console.log(store[storeName], "SSSSS");
    const docRef = doc(db, "BlazingStores", store[idName]);

    store[storeName].menuImages = [
      ...store[storeName].menuImages,
      ...resultArr,
    ];
    // console.log(storeState.menuImages);
    // console.log(selectedImages);
    result[storeName] = store[storeName];
    // console.log(100, storeState.menuImages, data);
    localStorage.setItem("storeData", JSON.stringify(store[storeName]));

    await updateDoc(docRef, result);
    await fetchImage();
    alert("Image added successfully");
  };
  return (
    <div className="MainPopup">
      <h1>Add images to menu</h1>
      <select
        className="selectMenu"
        onChange={(event) => {
          setStore(
            data.find((store) => Object.keys(store)[0] === event.target.value)
          );
        }}
      >
        <option disabled selected value={null}>
          None
        </option>
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
      <div className="ImageUrlsDiv">
        {store !== null &&
          imageUrls.map(
            (url, i) =>
              !store[Object.keys(store)[0]].menuImages
                .map((data) => data.url)
                .includes(url) && (
                <div className="ImageInnerUrlDiv">
                  {selectedImages.includes(url) ? (
                    <div className="checkMarkPopupImage">
                      <RiCheckboxBlankCircleFill />
                    </div>
                  ) : (
                    <div className="checkMarkPopupImage2">
                      <RiCheckboxBlankCircleFill />
                    </div>
                  )}

                  <img
                    onClick={() => imageOnClickEvent(url, i)}
                    alt=""
                    className="ImageUrlImage"
                    width={"150px"}
                    height={"90px"}
                    style={
                      selectedImages.includes(url)
                        ? { border: "3px solid #006600" }
                        : {}
                    }
                    src={url}
                  ></img>
                </div>
              )
          )}
      </div>
      <button onClick={() => addImagesToStore()} className="EnterButton">
        Enter
      </button>
    </div>
  );
};

export default Popup2;
