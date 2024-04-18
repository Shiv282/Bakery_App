"use client";
import { useEffect, useState } from "react";
import WelcomeButton from "./welcomeButton";
import axios from "axios";
import BestCombination from "./bestcombination";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
  dialogContent: {
    maxHeight: 400, // Adjust the max height as needed
    overflowY: "auto",
  },
}));



export default function Home() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const [ingredients, setIngredients] = useState();
  const [initialIngredients, setinitialIngredients] = useState();
  const [title, setTitle] = useState("Welcome");
  const [secondTitle, setSecondTitle] = useState("");
  const [thirdTitle, setThirdTitle] = useState("");
  const [fourthTitle, setFourthTitle] = useState("");
  const [eatables, setEatables] = useState();
  const [shapes, setShapes] = useState([]);
  const [addons, setAddons] = useState([]);
  const [cart, setCart] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const [activeShapePrice, setActiveShapePrice] = useState(0);
  const [activeEatablePrice, setActiveEatablePrice] = useState(0);
  const [activeAddonPrice, setActiveAddonPrice] = useState(0);
  const [activeEatable, setActiveEatable] = useState();
  const [activeShape, setActiveShape] = useState();
  const [activeAddon, setActiveAddon] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);

  const [caloriesEatable, setCaloriesEatable] = useState(0);
  const [caloriesAddon, setCaloriesAddon] = useState(0);
  const [timeEatable, setTimeEatable] = useState(0);
  const [timeShape, setTimeShape] = useState(0);

  const [currentSection, setCurrentSection] = useState("main");


  const handleOpen = async (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "GET",
        url: "http://localhost:8000/api/inventory/",
      });
      console.log(response.data);
      setIngredients(response.data);

      setinitialIngredients(response.data);
    }
    fetchData();
  }, []);

  function checkIfShapeShouldBeDisabled(shape) {
    for (const value of eatables) {
      if (value.dishName == activeEatable) {
        if (value.shapes.includes(shape.shapeName)) {
          console.log(shape.shapeName);
        } else {
          setTimeout(() => {
            console.log(shape.shapeName);
            document
              .getElementById(shape.shapeName)
              .setAttribute("disabled", "true");
            document
              .getElementById(shape.shapeName)
              .setAttribute("title", "Reciepe doesnt support this shape");
          }, 500);
        }
      }
    }
  }

  const checkIfEatableShouldBeDisabled = (eatable) => {
    for (const [eatableIngredient, quantity] of Object.entries(
      eatable.ingredients
    )) {
      ingredients.map((ingredient) => {
        if (ingredient.item == eatableIngredient) {
          if (quantity > ingredient.quantity) {
            setTimeout(() => {
              document
                .getElementById(eatable.dishName)
                .setAttribute("disabled", "true");
              document
                .getElementById(eatable.dishName)
                .setAttribute("title", "Ingredients not sufficient");
            }, 500);
          }
        }
      });
    }
  };

  useEffect(() => {
    handleInputChange();
  }, [itemCount]);

  useEffect(() => {
    const total = Object.values(cart).reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    console.log("total", total);
    setGrandTotal(total);
  }, [cart]);

  const handleInputChange = () => {
    console.log("ic", itemCount);
    console.log("ip", itemPrice);
    console.log(activeShapePrice);
    console.log(activeEatablePrice);
    console.log(activeAddonPrice);
    setItemPrice(itemCount * (activeShapePrice + activeEatablePrice + 10));
  };

  return (
    <main className="bg-gradient-to-r from-purple-500 to-pink-500 flex min-h-screen flex-col items-center justify-between p-8">
      <div className="w-full flex flex-row">
        <div className="w-3/4 mr-3 relative">
          <div className="relative z-10 text-center place-content-center flex flex-rows items-center justify-center">
            <button
              className="bg-gray-300 mx-10 text-black p-3 rounded-md hover:bg-green-300"
              onClick={() => {
                setCurrentSection("main");
              }}
            >
              Choose reciepe
            </button>
            <button
            className="bg-gray-300 text-black p-3 rounded-md hover:bg-green-300"
              onClick={() => {
                setCurrentSection("bestCombination");
              }}
            >
              Choose Ingredients best combination
            </button>
          </div>
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-0 rounded-xl"></div>
          {currentSection == "main" ? <MainPage /> : <BestCombination setCart={setCart}/>}
        </div>

        <div className="w-1/4 relative p-3">
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-0 rounded-xl"></div>
          <div className="relative z-10 text-center min-h-screen place-content-center">
            <h1 className="text-black text-center font-black text-2xl mb-5">
              Cart
            </h1>
            {cart &&
              cart.map((c) => (
                <div className="bg-white p-4 m-4">
                  <ul>
                    <li className="text-black">Reciepe : {c.dish}</li>
                    <li className="text-black">Shape : {c.shape}</li>
                    <li className="text-black">Add-on : {c.addons}</li>
                    <li className="text-black">Quantity : {c.noOfPieces}</li>
                    <li className="text-black">
                      Price of each : {c.itemPrice}
                    </li>
                    <li className="text-black">
                      Price of {c.quantity} : {c.totalPrice}
                    </li>
                  </ul>
                </div>
              ))}
            <h1 className="text-black text-center font-bolded text-l mb-5">
              Grand Total : {grandTotal}
            </h1>
            <div>
              <button
                onClick={async () => {
                  console.log(cart);
                  
                  handleOpen();
                }}
                className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
              >
                Buy Now
              </button>
            </div>

            <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>Bill</DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
        {cart &&
              cart.map((c) => (
                <div className="bg-white p-4 m-4">
                  <ul>
                    <li className="text-black">Reciepe : {c.dish}</li>
                    <li className="text-black">Shape : {c.shape}</li>
                    <li className="text-black">Add-on : {c.addons}</li>
                    <li className="text-black">Quantity : {c.noOfPieces}</li>
                    <li className="text-black">
                      Price of each : {c.itemPrice}
                    </li>
                    <li className="text-black">
                      Price of {c.quantity} : {c.totalPrice}
                    </li>
                  </ul>
                </div>
              ))}

              <div className="text-center"> 
        <h1 className="text-black text-center font-bolded text-l mb-5">
              Grand Total : {grandTotal}
        </h1>
        <button
                onClick={async () => {
                  const response = await axios({
                    method: "POST",
                    url: "http://localhost:8000/api/order/array",
                    data: cart,
                  });
                  handleClose();
                }}
                className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
              >
                Confirm
              </button>
              </div>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>
    </main>
  );

  function MainPage() {
    return (
      <div className="relative z-10 text-center min-h-screen place-content-center">
        {title != "Welcome" ? (
          <h1 className="text-black text-center font-black text-2xl mb-3">
            Ingredients
          </h1>
        ) : (
          <div></div>
        )}
        {eatables && ingredients && (
          <div className="mb-10 grid grid-cols-4 gap-3">
            {ingredients.map((ingredient, index) => (
              <div className="bg-gray-100 p-2 rounded-md" key={index}>
                <p className="text-black text-center">
                  {ingredient.item} : {ingredient.quantity}
                </p>
              </div>
            ))}
          </div>
        )}

        <h1 className="text-black text-center font-black text-2xl">{title}</h1>
        <WelcomeButton
          title={title}
          setTitle={setTitle}
          setEatables={setEatables}
          setActiveEatablePrice={setActiveEatablePrice}
        />
        <div className="flex flex-row place-content-center gap-3">
          {eatables &&
            eatables.map((eatable, index) => (
              <div key={index}>
                <button
                  id={eatable.dishName}
                  className={
                    (eatable.dishName == activeEatable)?"bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed":"bg-gray-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed"
                  }
                  key={index}
                  disabled={checkIfEatableShouldBeDisabled(eatable)}
                  onClick={async () => {
                    setSecondTitle("Choose Shape");
                    setCaloriesEatable(eatable.calorieValue);
                    setTimeEatable(eatable.cookingTime);
                    setActiveEatable(eatable.dishName);
                    setActiveEatablePrice(eatable.price);
                    setAddons([]);
                    setThirdTitle("");
                    setFourthTitle("");
                    const response = await axios({
                      method: "GET",
                      url: "http://localhost:8000/api/bakery/shapes",
                    });
                    console.log(response.data);

                    setShapes(response.data);
                    setActiveAddonPrice(0);
                    setActiveShapePrice(0);
                    document
                      .getElementById(eatable.dishName)
                      .setAttribute(
                        "class",
                        "bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed"
                      );
                    document
                      .getElementById(eatable.dishName)
                      .setAttribute("title", "Selected");
                  }}
                >
                  {eatable.dishName}
                </button>
              </div>
            ))}
        </div>

        <h1 className="text-black text-center font-black text-2xl">
          {secondTitle}
        </h1>
        <div className="flex flex-row place-content-center gap-3">
          {shapes &&
            shapes.map((shape, index) => (
              <div key={index}>
                <button
                  id={shape.shapeName}
                  className={
                    (shape.shapeName == activeShape)?"bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed":"bg-gray-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed"
                  }
                  key={index}
                  disabled={checkIfShapeShouldBeDisabled(shape)}
                  onClick={async () => {
                    setThirdTitle("Choose Add-ons");
                    setActiveShape(shape.shapeName);
                    setTimeShape(shape.timeDuration);
                    setFourthTitle("");
                    setActiveShapePrice(shape.priceForShape);
                    setAddons(shape.addonsList);
                    setActiveAddonPrice(0);
                    document
                      .getElementById(shape.shapeName)
                      .setAttribute(
                        "class",
                        "bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed"
                      );
                    document
                      .getElementById(shape.shapeName)
                      .setAttribute("title", "Selected");
                  }}
                >
                  {shape.shapeName}
                </button>
              </div>
            ))}
        </div>

        <h1 className="text-black text-center font-black text-2xl">
          {thirdTitle}
        </h1>
        <div className="flex flex-row place-content-center gap-3">
          {addons &&
            addons.map((addon, index) => (
              <div key={index}>
                <button
                  id={addon}
                  className={
                    (activeAddon.includes(addon))?"bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed":"bg-gray-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2 disabled:bg-red-600 disabled:cursor-not-allowed"
                  }
                  key={index}
                  onClick={() => {
                    setFourthTitle("Enter Quantity");
                    setActiveAddon((prevActiveAddons) => [
                      ...prevActiveAddons,
                      addon,
                    ]);
                    setCaloriesAddon((prevPrice) => {
                      for (const val of ingredients) {
                        if (val.item == addon) {
                          return val.calorificValue * 10 + prevPrice;
                        }
                      }
                    });
                    setActiveAddonPrice((prevPrice) => {
                      for (const val of ingredients) {
                        if (val.item == addon) {
                          return val.price * 10 + prevPrice;
                        }
                      }
                    });

                    document
                      .getElementById(addon)
                      .setAttribute("title", "Selected");
                    document
                      .getElementById(addon)
                      .setAttribute("disabled", "true");
                  }}
                >
                  {addon} +
                </button>
              </div>
            ))}
        </div>

        <h1 className="text-black text-center font-black text-2xl">
          {fourthTitle}
        </h1>

        {fourthTitle ? (
          <div>
            <button
              disabled={itemCount == 0}
              onClick={() => {
                setItemCount((count) => {
                  return count - 1;
                });
              }}
            >
              -
            </button>
            <h1>{itemCount}</h1>
            <button
              onClick={() => {
                setItemCount((count) => {
                  return count + 1;
                });
              }}
            >
              +
            </button>
          </div>
        ) : (
          <div></div>
        )}

        {itemPrice ? (
          <div>
            <h1 className="text-black text-center font-black text-2xl">
              Cost for 1 : {itemPrice / itemCount}
            </h1>
            <h1 className="text-black text-center font-black text-2xl">
              No : {itemCount}
            </h1>
            <h1 className="text-black text-center font-black text-2xl">
              Total cost : {itemPrice}
            </h1>
            <h1 className="text-black text-center font-black text-2xl">
              Calorie for 1 : {caloriesAddon + caloriesEatable}
            </h1>
            <h1 className="text-black text-center font-black text-2xl">
              Total calories : {(caloriesAddon + caloriesEatable) * itemCount}
            </h1>
            <h1 className="text-black text-center font-black text-2xl">
              Total time : {timeEatable + timeShape}
            </h1>

            <button
              className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
              onClick={() => {
                var cartItem = {
                  orderId: Math.random(),
                  dish: activeEatable,
                  shape: activeShape,
                  addons: activeAddon,
                  noOfPieces: itemCount,
                  itemPrice: itemPrice / itemCount,
                  totalPrice: itemPrice,
                  totalCalorificValue: caloriesAddon + caloriesEatable,
                  finalCookingTime: timeEatable + timeShape,
                };
                setCart((prevCart) => [...prevCart, cartItem]);

                setSecondTitle("");
                setShapes([]);
                setThirdTitle("");
                setAddons([]);
                setFourthTitle("");
                setItemPrice(0);
                setItemCount(0);
              }}
            >
              Add to cart
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
