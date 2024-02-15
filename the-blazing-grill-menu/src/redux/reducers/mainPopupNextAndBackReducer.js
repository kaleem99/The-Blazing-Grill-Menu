import { BACK, NEXT } from "../constants";

const initialState = 0;

export const mainPopupNextAndBackReducer = (state = initialState, action) => {
  switch (action?.type) {
    case NEXT:
      state = state === 0 ? state + 1 : state - 1;
      console.log(state);
      return state;
    case BACK:
      const newindex = state === 1 ? state - 1 : state + 1;
      state = newindex;
      return state;
    default:
      return state;
  }
};
