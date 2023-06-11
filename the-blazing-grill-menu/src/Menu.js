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
            width: "96%",
            height: "auto",
            // backgroundColor: "red",
            margin: "2vh auto",
            // border: "1px solid",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "40%",
              //   border: "1px solid white",
              // background: "red",
              margin: "auto",
            }}
          >
            <img
              style={{ width: "70%" }}
              alt=""
              className="BlazingImage"
              src="https://www.theblazinggrill.co.za/wp-content/uploads/2021/07/TBG_Final_TransWhite.png"
            ></img>
            <br></br>
            <text>Menu</text>
          </div>
          <div className="SectionName" style={{ marginTop: "4%" }}>
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
        </div>
      </div>
      <div className="Middle">
        <div style={{ width: "96%", height: "96vh", margin: "2vh auto" }}>
          <div
            style={{
              width: "100%",
              height: "27%",
              border: "1px solid white",
              marginBottom: "2vh",
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
              height: "auto",
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
                  <p className="itemNames">Extras</p>
                </div>
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
                    Veggies
                  </p>

                  <p className="price">R10.00</p>
                </div>
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
                    Cheese
                  </p>

                  <p className="price">R15.00</p>
                </div>
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
                    Meat
                  </p>

                  <p className="price">R20.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Right">
        <div
          style={{
            width: "96%",
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
              // marginBottom: "2vh",
              position: "relative",
              backgroundImage: `url(${pizza2})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <img
              style={{
                width: "50%",
                height: "12%",
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
