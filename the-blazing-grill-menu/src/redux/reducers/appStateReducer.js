import { fetchLocalStorage } from "../../Helpers.js/fetchLocalStorage";
import {
  UPDATE_APP_STATE,
  UPDATE_ID_STATE,
  UPDATE_STORE_STATE,
  RESIZE_ITEMS_STATE,
  RESIZE_IMAGES_STATE,
} from "../constants";

const initialState = {
  storeState: null,
  id: "",
  state: [],
  menu: [],
  allItems: [],
  pageImages: [],
  images: [],
};
const newDataArr = [];
const menuDataArr = [];
const newImageArr = [];
const imageArr = [];
export const appStateReducer = (state = initialState, action) => {
  switch (action?.type) {
    case UPDATE_APP_STATE:
      let localStoreData = JSON.parse(fetchLocalStorage("storeData"));
      if (localStoreData) {
        let localStoreId = fetchLocalStorage("storeId");

        const newState = {
          ...state,
          storeState: localStoreData,
          id: localStoreId,
        };

        localStoreData.menuItems.forEach((data) => {
          if (data.page === action.payload.PAGE && data.positionX !== "None") {
            newDataArr.push(data);
          } else {
            if (data.page === "None") {
              menuDataArr.push(data);
            }
          }
        });

        localStoreData.menuImages.map((data) => {
          if (data.page === action.payload.PAGE && data.positionX !== "None") {
            console.log(data);
            newImageArr.push(data);
          } else {
            if (data.page === "None") {
              imageArr.push(data);
            }
          }
        });
        newState.pageImages = newImageArr;
        newState.images = imageArr;
        newState.state = newDataArr;
        newState.menu = menuDataArr;
        let ItemsDataArr = JSON.parse(fetchLocalStorage("ITEMS"));
        newState.allItems = ItemsDataArr;

        return newState;
      }
      return state;
    case RESIZE_ITEMS_STATE:
      var newState = { ...state, state: action.payload };
      return newState;
    case RESIZE_IMAGES_STATE:
      newState = { ...state, pageImages: action.payload };
      return newState;
    case UPDATE_ID_STATE:
      newState = { ...state, id: action.payload };
      return newState;
    case UPDATE_STORE_STATE:
      newState = { ...state, storeState: action.payload };
      return newState;
    default:
      return state;
  }
};
