import { useEffect, useState } from "react";
import { db, storage } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";
import pizzas from "./assets/Pizzas.jpg";
import pizza2 from "./assets/VegetarianPizza.jpg";
import sanhaImage from "./assets/newSanhaLogo.png";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
function Menu({ state, setState }) {
  useEffect(() => {
    let newDataArr = [];

    const fetchPost = async () => {
      MenuItemsSection.map((data) => {
        const unsubscribe = onSnapshot(
          collection(db, data.name),
          (querySnapshot) => {
            const newData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              // id: doc.id,
            }));
            newDataArr.push({ name: data.name, data: newData });
            setState(newDataArr);
          }
        );

        // Store the unsubscribe function to clean up the listener later
        data.unsubscribe = unsubscribe;
      });
    };

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

  // const fetchPost = async (name) => {
  //   let newDataArr = [];
  //   MenuItemsSection.map(async (data) => {
  //     await getDocs(collection(db, data.name)).then((querySnapshot) => {
  //       const newData = querySnapshot.docs.map((doc) => ({
  //         ...doc.data(),
  //         // id: doc.id,
  //       }));
  //       newDataArr.push({ name: data.name, data: newData });
  //       setState(newDataArr);
  //     });
  //   });
  // };
  console.log(state);
  return state.length > 1 ? (
    <div className="Menu">
      <div className="Left">
        <div
          style={{
            width: "98%",
            height: "96vh",
            // backgroundColor: "red",
            margin: "1vh auto",
            // border: "1px solid",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "30%",
              //   border: "1px solid white",
              // background: "red",
              margin: "auto",
            }}
          >
            <img
              style={{ height: "80%" }}
              alt=""
              className="BlazingImage"
              src="https://www.theblazinggrill.co.za/wp-content/uploads/2021/07/TBG_Final_TransWhite.png"
            ></img>
            <br></br>
            <text>Menu</text>
          </div>
          <div className="SectionName" style={{ marginTop: "1vh" }}>
            <text>{state[5].name !== undefined && state[5].name}</text>
          </div>
          <div
            style={{
              width: "100%",
              height: "auto",
              border: "1px solid white",
              // margin: "3% auto",
              // borderBottom: "0px",
            }}
          >
            {state[5].data.map((items) => {
              return (
                <div className="ItemsData">
                  <div className="NameAndPrice">
                    <p className="itemNames">{items.name}</p>
                    <div>
                      <p className="price"> R{items.price}</p>
                    </div>
                  </div>
                  <div className="Information">{items.Information} </div>
                </div>
              );
            })}
          </div>
          <div className="SectionName" style={{ marginTop: "1vh" }}>
            <text>{state[9].name !== undefined && state[9].name}</text>
          </div>
          <div
            style={{
              width: "100%",
              height: "auto",
              border: "1px solid white",
              // margin: "3% auto",
              // borderBottom: "0px",
            }}
          >
            {state[9].data.map((items) => {
              return (
                <div className="ItemsData">
                  <div className="NameAndPrice">
                    <p className="itemNames">{items.name}</p>
                    <div>
                      <p className="price"> R{items.price}</p>
                    </div>
                  </div>
                  <div className="Information">{items.Information} </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="Middle">
        <div style={{ width: "98%", height: "96vh", margin: "1vh auto" }}>
          <div
            style={{
              width: "100%",
              height: "27%",
              border: "1px solid white",
              marginBottom: "1vh",
            }}
          >
            <img
              style={{ width: "100%", height: "100%" }}
              alt=""
              className="BlazingImage"
              src={pizzas}
            ></img>
          </div>
          <div className="SectionName">
            <text>{state[6].name !== undefined && state[6].name}</text>
          </div>
          <div
            style={{
              width: "100%",
              height: "67%",
              border: "1px solid white",
              // borderBottom: "0px",
              //   marginTop: "4%",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gridColumnGap: "20px",
              }}
            >
              {state[6].data.map((items) => {
                return (
                  <div className="ItemsData">
                    <div className="NameAndPrice">
                      <p className="itemNames">{items.name}</p>
                      <div>
                        <p className="price"> R{items.price}</p>
                      </div>
                    </div>
                    <div className="Information">{items.Information} </div>
                  </div>
                );
              })}
              <div className="ItemsData">
                <div className="NameAndPrice">
                  <p className="itemNames">{state[11].name}</p>
                </div>
                {state[11].data
                  .sort((a, b) => a.price - b.price)
                  .map((items) => {
                    return (
                      <div className="NameAndPrice">
                        <p
                          style={{
                            width: "60%",
                            color: "white",
                            textAlign: "left",
                            fontWeight: "bold",
                            fontSize: "larger",
                            marginBlockStart: "0px",
                            marginBlockEnd: "0px",
                          }}
                        >
                          {items.name}
                        </p>

                        <p className="price">{items.price}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Right">
        <div
          style={{
            width: "98%",
            height: "100vh",
            // backgroundColor: "red",
            marginRight: "0px",
            marginLeft: "auto",
            borderLeft: "1px solid white",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid white",
              // marginBottom: "1vh",
              position: "relative",
              backgroundImage: `url(${pizza2})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <img
              style={{
                width: "58%",
                height: "11%",
                position: "relative",
                top: "3%",
                margin: "auto",
                right: "1%",

                // right: 0,
              }}
              alt=""
              className="BlazingImage"
              src={sanhaImage}
            ></img>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
}

export default Menu;
