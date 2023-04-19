"use client";

import { useState } from "react";
import { RiArrowDropDownFill, RiArrowDropLeftFill } from "react-icons/ri";
import Offer from "./Offer";

type Props = {};

function Offers({}: Props) {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div
        className="
    flex flex-wrap gap-4 justify-evenly pt-4
    sm:py-8"
      >
        <div>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-01.png"
            }
            text={"Lifetime FREE Labor Charges."}
          />
        </div>
        <div>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-02.png"
            }
            text={"90 days One to One Exchange."}
          />
        </div>
        <div>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-03.png"
            }
            text={"FREE On-Site Service / Repair within Klang Valley."}
          />
        </div>
        <div className={`${toggle ? "block" : "hidden"} offer:block`}>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-04.png"
            }
            text={"Full Years Warranty Covered. Up to 10 Years."}
          />
        </div>
        <div className={`${toggle ? "block" : "hidden"} offer:block`}>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-05.png"
            }
            text={"FREE Warranty Pick-Up and Return Covered Whole Malaysia."}
          />
        </div>
        <div className={`${toggle ? "block" : "hidden"} offer:block`}>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-15.png"
            }
            text={"Extra 5% Rebate For Future Upgrade."}
          />
        </div>
      </div>
      <button
        className="
      flex text-center mx-auto underline text-accent items-center my-4 mobilehover:hover:text-white
      offer:hidden"
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        See More{" "}
        {toggle ? (
          <RiArrowDropDownFill size={30} />
        ) : (
          <RiArrowDropLeftFill size={30} />
        )}
      </button>
    </>
  );
}

export default Offers;
