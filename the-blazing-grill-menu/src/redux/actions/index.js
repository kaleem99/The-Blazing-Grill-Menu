import {
  UPDATE_APP_STATE,
  UPDATE_MENU_STATE,
  UPDATE_IMAGES_STATE,
  UPDATE_ZOOM_STATE,
  UPDATE_MENU_PAGES_STATE,
  UPDATE_DRAG_ELEMENT_STATE,
  UPDATE_RESIZE_ELEMENT_STATE,
  UPDATE_STORE_STATE,
  UPDATE_ID_STATE,
  UPDATE_ALL_ITEMS_STATE,
} from "../constants";

export const appState = (updatedAppData) => {
  return {
    type: UPDATE_APP_STATE,
    payload: updatedAppData,
  };
};

export const menuState = (updatedAppData) => {
  return {
    type: UPDATE_MENU_STATE,
    payload: updatedAppData,
  };
};

export const imageState = () => {
  return {
    type: UPDATE_IMAGES_STATE,
  };
};

export const zoomState = () => {
  return {
    type: UPDATE_ZOOM_STATE,
  };
};

export const menuPages = () => {
  return {
    type: UPDATE_MENU_PAGES_STATE,
  };
};

export const dragElement = () => {
  return {
    type: UPDATE_DRAG_ELEMENT_STATE,
  };
};

export const resizeElement = () => {
  return {
    type: UPDATE_RESIZE_ELEMENT_STATE,
  };
};

export const storeState = () => {
  return {
    type: UPDATE_STORE_STATE,
  };
};

export const idState = () => {
  return {
    type: UPDATE_ID_STATE,
  };
};

export const allItems = () => {
  return {
    type: UPDATE_ALL_ITEMS_STATE,
  };
};
