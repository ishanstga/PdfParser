import React from "react";
import logo from "./assets/logo.png";
import slogan from "./assets/slogan.png";
import CardWithForm from "@/components/CardWithForm";
import GetPDFs from "@/components/getPDFs";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <div className=" px-5 md:ml-5 mt-5 md:mt-5 flex flex-raw sm:gap-5 md:gap-80">
          <img src={logo} alt="Metana Logo" className="w-[150px] md:w-auto" />
          <div></div>
          <div></div>
          <div className="flex flex-col items-end mt-4">
            <GetPDFs />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-0">
        {/* Left Section*/}
        <div className="flex-1 flex justify-center items-center p-4 md:p-0">
          <CardWithForm />
        </div>

        {/* Right Section*/}
        <div className="hidden md:flex flex-1 justify-center items-center">
          <img
            src={slogan}
            alt="Metana slogan"
            className="w-2/3 lg:w-1/2 xl:w-auto max-w-[700px]"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
