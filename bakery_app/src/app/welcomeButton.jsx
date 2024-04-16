import axios from "axios";
export default function WelcomeButton({ title, setTitle, setEatables,setActiveEatablePrice }){
    if(title=="Welcome"){
        return(
            <button
              className={"bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-lg mt-2"}
              onClick={async() => {
                setTitle("Choose what do you wanna eat");
                const response = await axios({
                    method: "GET",
                    url: "http://localhost:8000/api/bakery/recipes",
                  });
                  console.log(response.data);
                  setEatables(response.data);
                  setActiveEatablePrice(0);
              }}
            >
              Get Started
            </button>
        )
    }else{
        return(
            <>
            
            </>
        )
    }
}