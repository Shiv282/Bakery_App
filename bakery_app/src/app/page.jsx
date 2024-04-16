"use client";
import { useEffect, useState } from "react";
import WelcomeButton from "./welcomeButton";
import axios from "axios";

const adds = ["Nuts", "Choco chips", "cherries", "sprinklers"];

export default function Home() {
  const [title, setTitle] = useState("Welcome");
  const [secondTitle, setSecondTitle] = useState("");
  const [thirdTitle, setThirdTitle] = useState("");
  const [fourthTitle, setFourthTitle] = useState("");
  const [eatables, setEatables] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [addons, setAddons] = useState([]);
  const [cart, setCart] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const [activeShapePrice, setActiveShapePrice] = useState(0);
  const [activeEatablePrice, setActiveEatablePrice] = useState(0);
  const [activeAddonPrice, setActiveAddonPrice] = useState(0);
  const [activeEatable, setActiveEatable] = useState();
  const [activeShape, setActiveShape] = useState();
  const [activeAddon, setActiveAddon] = useState();
  const [itemCount, setItemCount] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);

  let timeoutId;

  useEffect(() => {
    handleInputChange();
  }, [itemCount]);

  useEffect(()=>{
    const total = Object.values(cart).reduce((acc, item) => acc + item.totalPrice, 0);
                    console.log("total",total);
                    setGrandTotal(total);
  },[cart]);
  

  const handleInputChange = () => {
    console.log("ic", itemCount);
    console.log("ip", itemPrice);
    console.log(activeShapePrice);
    console.log(activeEatablePrice);
    console.log(activeAddonPrice);
    setItemPrice(itemCount * (activeShapePrice + activeEatablePrice + 10));
  };

  return (
    <main className="bg-gradient-to-r from-purple-500 to-pink-500 flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full flex flex-row">
        <div className="w-3/4 mr-3 relative">
          <div className="absolute inset-0 bg-gray-200 bg-opacity-50 z-0 rounded-xl"></div>
          <div className="relative z-10 text-center min-h-screen place-content-center">
            <h1 className="text-black text-center font-black text-2xl">
              {title}
            </h1>
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
                      className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
                      key={index}
                      onClick={() => {
                        setSecondTitle("Choose Shape");
                        setActiveEatable(eatable.dishName);
                        setActiveEatablePrice(eatable.price);
                        setAddons([]);
                        setThirdTitle("");
                        setFourthTitle("");
                        setShapes(eatable.shapes);

                        setActiveAddonPrice(0);
                        setActiveShapePrice(0);
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
                      className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
                      key={index}
                      onClick={async () => {
                        setThirdTitle("Choose Add-ons");
                        setActiveShape(shape);
                        setFourthTitle("");
                        const response = await axios({
                          method: "GET",
                          url:
                            "http://localhost:8000/api/bakery/shapes/name/" +
                            shape,
                        });
                        console.log(response.data.addonsList);
                        setActiveShapePrice(response.data.priceForShape);
                        setAddons(response.data.addonsList);

                        setActiveAddonPrice(0);
                      }}
                    >
                      {shape}
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
                      className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
                      key={index}
                      onClick={() => {
                        setFourthTitle("Enter Quantity");
                        setActiveAddon(addon);
                        setActiveAddonPrice(addon.price);
                      }}
                    >
                      {addon}
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

                <button
                  className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
                  onClick={() => {
                    var cartItem = {
                      eatable: activeEatable,
                      shape: activeShape,
                      addon: activeAddon,
                      quantity: itemCount,
                      itemPrice: itemPrice / itemCount,
                      totalPrice: itemPrice,
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
                    <li className="text-black">Reciepe : {c.eatable}</li>
                    <li className="text-black">Shape : {c.shape}</li>
                    <li className="text-black">Add-on : {c.addon}</li>
                    <li className="text-black">Quantity : {c.quantity}</li>
                    <li className="text-black">Price of each : {c.itemPrice}</li>
                    <li className="text-black">
                      Price of {c.quantity} : {c.totalPrice}
                    </li>
                  </ul>
                </div>
              ))}
              <h1 className="text-black text-center font-bolded text-l mb-5">
              Grand Total : {grandTotal}
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
