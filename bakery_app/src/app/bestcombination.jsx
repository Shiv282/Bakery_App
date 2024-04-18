"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./form.css";
export default function BestCombination({setCart}){
    const [ingredients, setIngredients] = useState();
  const [results, setResults] = useState();
  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "GET",
        url: "http://localhost:8000/api/inventory/maintype/true",
      });
      console.log(response.data);
      setIngredients(response.data);
    }
    fetchData();
  }, []);

    return (
        <div className="relative z-10 text-center min-h-screen place-content-center">
        <div className="form-container w-3/4 m-5 p-5">
        <div className="form-header">
          <h2 className="form-title">Most effiecient choice</h2>
        </div>
        <div className=" grid grid-cols-5 gap-3">
          {ingredients &&
            ingredients.map((ingredient) => (
              <div className="form-field">
                <label htmlFor={ingredient.item}>{ingredient.item}</label>
                <input
                  className="text-black"
                  type="number"
                  name={ingredient.item}
                  id={ingredient.item}
                  max={ingredient.quantity}
                />
              </div>
            ))}
        </div>
        <div className="form-footer">
          <button
            className="btn"
            onClick={async () => {
              const transformedIngredients = ingredients.map((ingredient) => {
                const value = document.getElementById(ingredient.item).value;
                return { [ingredient.item]: value };
              });
              const transformedObject = {};

              transformedIngredients.forEach((item) => {
                const key = Object.keys(item)[0];
                transformedObject[key] = item[key];
              });
              console.log(transformedObject);
              const response = await axios({
                method: "POST",
                url: "http://localhost:8000/api/bakery/userInput",
                data: transformedObject,
              });
              console.log(response.data);
              setResults(response.data);
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="form-container w-3/4 m-5 p-5">
        <div className="flex flex-col">
            <h1 className="font-bold text-black text-xl">Best combination :</h1>
          {results &&
            results.bestCombination &&
            Object.entries(results.bestCombination).map(([key, value], index) => (
                <h1 className="text-black" key={index}>{`${key}: ${value}`}</h1>
              ))}
        </div>
        <h2 className="font-bold text-black text-xl">
          Max price : {results && results.maxTotalPrice}
        </h2>

        <button
              className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"
              onClick={async() => {

                const response = await axios({
                    method: "GET",
                    url: "http://localhost:8000/api/bakery/recipes",
                  });
                  console.log(response.data);
                  var items = response.data;
                Object.entries(results.bestCombination).map(([key, value], index) => {
                    var itemPrice = 0;
                    var calories = 0;
                    var time = 0;
                    for(const val of items){
                        console.log(val.dishName,"-",key);
                        if(val.dishName == key){
                            itemPrice = val.price;
                            calories = val.calorieValue;
                            time = val.cookingTime;
                        }
                    }
                    var cartItem = {
                        orderId: Math.random(),
                        dish: key,
                        shape: 'None',
                        addons: ['None'],
                        noOfPieces: value,
                        itemPrice: itemPrice,
                        totalPrice: itemPrice * value,
                        totalCalorificValue: calories * value,
                        finalCookingTime: time,
                      };
                      setCart((prevCart) => [...prevCart, cartItem]);
                    })

                
              }}
            >
              Add to cart
            </button>

      </div>
      </div>
    )
}