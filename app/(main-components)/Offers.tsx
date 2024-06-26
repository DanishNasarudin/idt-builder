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
            flex flex-wrap justify-evenly gap-4 pt-4
            sm:py-8"
        id="idt__main-section"
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
            text={"FREE On-Site Service / Repair within KL, Johor."}
          />
        </div>
        <div className={`hidden offer:block`}>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-04.png"
            }
            text={"Full Years Warranty Covered. Up to 10 Years."}
          />
        </div>
        <div className={`hidden offer:block`}>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-05.png"
            }
            text={"FREE Warranty Pick-Up and Return Covered Whole Malaysia."}
          />
        </div>
        <div className={`hidden offer:block`}>
          <Offer
            src={
              "https://idealtech.com.my/wp-content/uploads/2023/03/icons-08.png"
            }
            text={"Lifetime Technical Support."}
          />
        </div>
      </div>
      <div
        className={` ${
          toggle ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } grid transition-all`}
      >
        <div className="flex flex-wrap justify-evenly gap-4 overflow-hidden pt-4 sm:py-0">
          <div className={`block offer:hidden`}>
            <Offer
              src={
                "https://idealtech.com.my/wp-content/uploads/2023/03/icons-04.png"
              }
              text={"Full Years Warranty Covered. Up to 10 Years."}
            />
          </div>
          <div className={`block offer:hidden`}>
            <Offer
              src={
                "https://idealtech.com.my/wp-content/uploads/2023/03/icons-05.png"
              }
              text={"FREE Warranty Pick-Up and Return Covered Whole Malaysia."}
            />
          </div>
          <div className={`block offer:hidden`}>
            <Offer
              src={
                "https://idealtech.com.my/wp-content/uploads/2023/03/icons-08.png"
              }
              text={"Lifetime Technical Support."}
            />
          </div>
        </div>
      </div>

      <button
        className="
      relative z-[1] mx-auto my-4 flex items-center text-center text-accent underline offer:hidden
      mobilehover:hover:text-white"
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
      <p className="mb-10 text-center text-zinc-400">
        Terms & Conditions Apply.
      </p>
    </>
  );
}

export default Offers;
