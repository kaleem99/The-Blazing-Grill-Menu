import { useEffect, useState } from "react";
import { db, storage } from "./database/config";
import MenuItemsSection from "./frontend/menuSections";
import Burger from "./assets/BurgersMenu.jpg";
import pizza2 from "./assets/Vegetarian Pizza.jpg";
import sanhaImage from "./assets/newSanhaLogo.png";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
function MenuPage2({ state, setState }) {
  const [chicken, setChicken] = useState([]);
  const [burgers, setBurgers] = useState([]);
  const [gourmetBurger, setGourmetBurger] = useState([]);

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

        const grilledChicken = newDataArr.filter(
          (category) => category.name === "Grilled Chicken"
        );
        const burgers = newDataArr.filter(
          (category) => category.name === "Burgers"
        );
        const gourmetBurgers = newDataArr.filter(
          (category) => category.name === "Gourmet Burgers"
        );
        if (grilledChicken.length > 0 && burgers.length > 0) {
          let result = grilledChicken[0].data.filter(
            (data) => !data.name.includes("Fries")
          );
          let result2 = burgers[0].data.filter(
            (data) => !data.name.includes("Double")
          );
          let result3 = gourmetBurgers[0].data.filter(
            (data) => !data.name.includes("Double")
          );
          setChicken(result);
          setBurgers(result2);
          setGourmetBurger(result3);
        }
        setState(newDataArr);
      });
    });
  };
  console.log(state);
  const formatNames = (name) => {
    let result = name;
    if (name.toLowerCase().includes("single")) {
      result = name.replace(/\bSingle\b/g, "");
    }
    return result;
  };
  return state.length > 1 ? (
    <div className="Menu2">
      <div className="Left2">
        <div style={{ width: "96%", height: "96vh", margin: "2vh auto" }}>
          <div
            style={{
              width: "100%",
              height: "22%",
              border: "1px solid white",
              marginBottom: "2vh",
            }}
          >
            <img
              style={{
                width: "10%",
                height: "14%",
                position: "absolute",
                top: "1%",
                margin: "auto",
                left: "27%",

                // right: 0,
              }}
              alt=""
              className="BlazingImage"
              src={sanhaImage}
            ></img>
            <img
              style={{ width: "100%", height: "100%" }}
              alt=""
              className="BlazingImage"
              src={Burger}
            ></img>
          </div>
          <div className="SectionName">
            <text>{state[0].name !== undefined && state[0].name}</text>
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
                gridTemplateColumns: "auto",
                // gridGap: "10px",
              }}
            >
              {burgers
                .sort((a, b) => a.price - b.price)
                .map((items, i) => {
                  return (
                    <div className="ItemsData">
                      <div className="NameAndPriceBurgers">
                        <div>
                          {i === 0 && <p className="">None</p>}
                          <p className="itemNames">{formatNames(items.name)}</p>
                          <div className="Information">
                            {items.Information}{" "}
                          </div>
                        </div>
                        <div>
                          {i === 0 && <p className="price">Single</p>}

                          <p className="price"> R{items.price}</p>
                        </div>
                        <div>
                          {i === 0 && <p className="price">Double</p>}

                          {items.name !== "Shredded Chicken Burger" && (
                            <p className="price">
                              R{(parseFloat(items.price) + 20).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div className="Middle2">
        <div style={{ width: "96%", height: "96vh", margin: "2vh auto" }}>
          <div
            style={{
              width: "100%",
              height: "auto",
              border: "1px solid white",
              marginBottom: "2vh",
            }}
          >
            <div className="SectionName">
              <text>{state[2].name !== undefined && state[2].name}</text>
            </div>
            <div
              style={{
                width: "100%",
                height: "auto",
                // border: "1px solid white",
                // borderBottom: "0px",
                //   marginTop: "4%",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto",
                  //   gridGap: "10px",
                }}
              >
                {chicken
                  .sort((a, b) => a.price - b.price)
                  .map((items, i) => {
                    return (
                      <div className="ItemsData">
                        <div className="NameAndPriceChicken">
                          <div>
                            {i === 0 && (
                              <>
                                <p className="">Name</p>
                              </>
                            )}
                            <p className="itemNames">{items.name}</p>
                          </div>
                          <div>
                            {i === 0 && (
                              <>
                                <p className="price">Chicken</p>
                              </>
                            )}

                            <p className="price"> R{items.price}</p>
                          </div>
                          <div>
                            {i === 0 && (
                              <>
                                <p className="price">With Fries</p>
                              </>
                            )}

                            <p className="price">
                              R{(parseFloat(items.price) + 10).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="SectionName">
            <text>{state[1].name !== undefined && state[1].name}</text>
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
                gridTemplateColumns: "auto",
                gridGap: "10px",
              }}
            >
              {gourmetBurger
                .sort((a, b) => a.price - b.price)
                .map((items, i) => {
                  return (
                    <div className="ItemsData">
                      <div className="NameAndPriceBurgers">
                        <div>
                          {i === 0 && <p className="">None</p>}
                          <p className="itemNames">{formatNames(items.name)}</p>
                        </div>
                        <div>
                          {i === 0 && <p className="price">Single</p>}

                          <p className="price"> R{items.price}</p>
                        </div>
                        <div>
                          {i === 0 && <p className="price">Double</p>}

                          {items.name.includes("Single") && (
                            <p className="price">
                              R{(parseFloat(items.price) + 30).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="Information">{items.Information}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div className="Right2">
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
              style={{ width: "60%" }}
              alt=""
              className="BlazingImage"
              src="https://www.theblazinggrill.co.za/wp-content/uploads/2021/07/TBG_Final_TransWhite.png"
            ></img>
            <br></br>
            <text>Menu</text>
          </div>
          <div className="SectionName" style={{ marginTop: "4%" }}>
            <text>{state[3].name !== undefined && state[3].name}</text>
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
            {state[3].data
              .sort((a, b) => a.price - b.price)
              .map((items) => {
                return (
                  <div className="ItemsData">
                    <div className="NameAndPrice">
                      <p className="itemNames">{items.name}</p>
                      <div>
                        <p className="price">R{items.price}</p>
                      </div>
                    </div>
                    <div className="Information">{items.Information} </div>
                  </div>
                );
              })}
          </div>
          <div className="SectionName" style={{ marginTop: "4%" }}>
            <text>{state[4].name !== undefined && state[4].name}</text>
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
            {state[4].data
              .sort((a, b) => a.price - b.price)
              .map((items) => {
                return (
                  <div className="ItemsData">
                    <div className="NameAndPrice">
                      <p className="itemNames">{items.name}</p>
                      <div>
                        <p className="price">R{items.price}</p>
                      </div>
                    </div>
                    {/* <div className="Information">{items.Information} </div> */}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
}

export default MenuPage2;
