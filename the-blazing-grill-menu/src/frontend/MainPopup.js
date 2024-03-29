import { db } from "../database/config";
import { collection, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import databaseNames from "../database/databaseNames";
import { FaBackward, FaForward } from "react-icons/fa";

import MenuItemsSection from "./menuSections";

import { useState, useEffect } from "react";

import { CSSTransition } from "react-transition-group";
import "./TransitionExample.css"; // Create this CSS file for transitions
import Popup1 from "./MainPopupFiles/Popup1";
import Popup2 from "./MainPopupFiles/Popup2";
import { connect, useDispatch } from "react-redux";
import { BACK, NEXT } from "../redux/constants";

const MainPopup = ({ storeState, id, fetchImage, currentIndex }) => {
  console.log(currentIndex);
  const [data, setData] = useState([]); // Initialize state for storing data
  const [store, setStore] = useState(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, databaseNames[0]),
      (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredData = newData.filter((data) => {
          let keyName = Object.keys(data)[0];
          //   console.log(keyName);
          if (keyName !== "admin") {
            return data;
          }
        });
        // console.log(filteredData);
        setData(filteredData); // Update the state with the new data
      }
    );
    return () => {
      // Cleanup function to unsubscribe when the component is unmounted
      unsubscribe();
    };
  }, []);
  const contentArray = [
    <Popup1
      // setStoreState={setStoreState}
      storeState={storeState}
      // setId={setId}
      id={id}
      data={data}
      setData={setData}
      store={store}
      setStore={setStore}
    />,
    <Popup2
      // setStoreState={setStoreState}
      storeState={storeState}
      // setId={setId}
      id={id}
      data={data}
      setData={setData}
      store={store}
      setStore={setStore}
      fetchImage={fetchImage}
    />,
    "Content 3",
  ];

  const handleNext = () => {
    dispatch({ type: NEXT, payload: { contentArray } });
  };

  const handleBack = () => {
    dispatch({ type: BACK, payload: { contentArray } });
  };

  return (
    <div>
      <div className="content-container">
        {contentArray.map((content, index) => (
          <CSSTransition
            key={index}
            in={index === currentIndex}
            timeout={500}
            classNames="slide"
            unmountOnExit
          >
            <div className="content">{content}</div>
          </CSSTransition>
        ))}
        <div className="NextAndBackMainPopup">
          <button className="AddButton2" onClick={handleBack}>
            <FaBackward />
          </button>
          <button className="AddButton" onClick={handleNext}>
            <FaForward />
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  const { storeState, id } = state.appStateReducer;
  return {
    currentIndex: state.mainPopupNextAndBackReducer,
    storeState,
    id,
  };
};
export default connect(mapStateToProps)(MainPopup);

//  I would like to find out which project codes i should use for CCA projects when logging time.
// awesome could you please send me when you have time the project MMID and type for CCA edio v2 CCALMS2-27975

// [
//   "Burgers",
//   "Gourmet Burgers",
//   "Grilled Chicken",
//   "Fries",
//   "Chicken Wings",
//   "On A Roll",
//   "Pizzas",
//   "Specials",
//   "Sauces",
//   "Drinks",
//   "Air Fryer Pizza",
//   "Grills",
//   "Extras",
// ];
