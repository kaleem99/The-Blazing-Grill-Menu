import { useEffect, useState } from "react";
import { db, storage } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
function Menu({ state, setState }) {
  useEffect(() => {
    if (state.length === 0) {
      fetchPost();
    }
  }, []);

  const fetchPost = async (name) => {
    let newDataArr = [];
    MenuItemsSection.map(async (data) => {
      await getDocs(collection(db, data.name)).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          // id: doc.id,
        }));
        newDataArr.push({ name: data.name, data: newData });
        setState(newDataArr);
      });
    });
  };
  console.log(state);
  return state.length > 1 ? (
    <div className="Menu">
      <div className="Left">
        <div
          style={{
            width: "90%",
            height: "94vh",
            // backgroundColor: "red",
            margin: "3vh auto",
            // border: "1px solid",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "40%",
              //   border: "1px solid white",
              margin: "auto",
            }}
          >
            <img
              style={{ width: "95%" }}
              alt=""
              className="BlazingImage"
              src="https://www.theblazinggrill.co.za/wp-content/uploads/2021/07/TBG_Final_TransWhite.png"
            ></img>
            <text>Menu</text>
          </div>
          <div
            style={{
              width: "100%",
              height: "60%",
              border: "1px solid white",
              margin: "auto",
            }}
          >
            <div className="SectionName">
              <text>{state[5].name !== undefined && state[5].name}</text>
            </div>
            {state[5].data.map((items) => {
              return (
                <div className="ItemsData">
                  <div className="NameAndPrice">
                    <p className="itemNames">{items.name}</p>
                    <div>
                      <p className="price">--------- R{items.price}</p>
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
        <div style={{ width: "90%", height: "94vh", margin: "3vh auto" }}>
          <div
            style={{
              width: "100%",
              height: "22%",
              border: "1px solid white",
              marginBottom: "2vh",
            }}
          ></div>
          <div
            style={{
              width: "100%",
              height: "76%",
              border: "1px solid white",
              //   marginTop: "4%",
            }}
          >
            <div className="SectionName">
              <text>{state[6].name !== undefined && state[6].name}</text>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gridGap: "10px",
              }}
            >
              {state[6].data.map((items) => {
                return (
                  <div className="ItemsData">
                    <div className="NameAndPrice">
                      <p className="itemNames">{items.name}</p>
                      <div>
                        <p className="price">--------- R{items.price}</p>
                      </div>
                    </div>
                    <div className="Information">{items.Information} </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="Right"></div>
    </div>
  ) : (
    <div></div>
  );
}

export default Menu;
