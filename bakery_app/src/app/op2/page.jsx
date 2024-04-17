"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./form.css";
export default function Home() {
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
    <main className="bg-gradient-to-r from-purple-500 to-pink-500 flex min-h-screen flex-col items-center justify-between p-8">
      <div className="form-container w-3/4">
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
      <div className="form-container w-3/4">
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
      </div>
    </main>
  );
}
