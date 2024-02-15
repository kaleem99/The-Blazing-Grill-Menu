import { combineReducers } from "redux";
import { appStateReducer } from "./appStateReducer";
import { mainPopupNextAndBackReducer } from "./mainPopupNextAndBackReducer";
import { fetchImagesReducer } from "./fetchImagesReducer";

// const appState = appStateReducer();
// const mainPopupNextAzndBack = mainPopupNextAndBackReducer();
// console.log(mainPopupNextAndBack);
export const rootReducer = combineReducers({
  appStateReducer,
  mainPopupNextAndBackReducer,
  fetchImagesReducer,
});
