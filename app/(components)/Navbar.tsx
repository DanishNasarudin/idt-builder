"use client";

import Link from "next/link";
import { useState } from "react";
import {
  RiArrowDropDownFill,
  RiArrowDropLeftFill,
  RiCloseLine,
  RiMenuLine,
} from "react-icons/ri";

type Props = {};

function Navbar({}: Props) {
  const [toggle, setToggle] = useState(true);
  const [offerToggle, setOfferToggle] = useState(false);
  const [careToggle, setCareToggle] = useState(false);
  return (
    <nav
      className=" 
    bg-primary/30 sticky top-0 border-b-[1px] border-white/10 z-50
    sm:border-b-0"
    >
      <div
        className="
        before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-md before:top-0 before:-z-10
      relative"
      >
        <ul
          className="
      flex justify-between items-center w-4/5 mx-auto text-xs py-4 z-20
      sm:py-8"
        >
          <Link href="/">
            <img
              src="https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png"
              alt="logo"
              className="w-10 z-10"
            />
          </Link>
          <div
            className={`
            before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-md before:top-0 before:-z-[10]
            sm:before:content-none
            ${
              toggle ? "hidden" : "flex"
            } flex-col absolute top-[99%] w-full text-center gap-8 left-0 py-8 bg-primary/50 border-y-[1px] border-white/10
            sm:relative sm:flex sm:flex-row sm:justify-between sm:pl-10 sm:w-full sm:py-0 sm:border-y-0 sm:bg-transparent`}
          >
            <li key={"home"}>
              <Link href="/">
                <p className="h-full flex items-center justify-center">Home</p>
              </Link>
            </li>
            <li key={"about"}>
              <Link href="/">
                <p className="h-full flex items-center justify-center">About</p>
              </Link>
            </li>
            <li key={"specialoffer"}>
              <p
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setOfferToggle(!offerToggle);
                  setCareToggle(false);
                }}
              >
                Special Offer{" "}
                {offerToggle ? (
                  <RiArrowDropDownFill size={20} />
                ) : (
                  <RiArrowDropLeftFill size={20} />
                )}
              </p>
              <div
                className={`
                sm:before:absolute sm:before:w-full sm:before:h-full sm:before:backdrop-blur-md sm:before:top-0 sm:before:left-0 sm:before:-z-[10] sm:mt-0
                ${
                  offerToggle
                    ? "sm:before:content-['']"
                    : "sm:before:content-none"
                }
            relative py-0 translate-y-0 gap-8 flex flex-col border-white/0
            ${offerToggle ? "mt-8" : "mt-0"}
            ${offerToggle ? "sm:absolute" : "sm:hidden"}
            sm:primary/30 sm:py-10 sm:px-10 sm:-translate-x-[20%] sm:translate-y-[30%] sm:border-b-[1px] sm:border-white/10`}
              >
                <div
                  className={`
            ${offerToggle ? "block" : "hidden"} h-full`}
                  key={"packagepc"}
                >
                  <Link href="/">
                    <p className="h-full flex items-center justify-center">
                      Package PC
                    </p>
                  </Link>
                </div>
                <div
                  className={`
            ${offerToggle ? "block" : "hidden"} h-full`}
                  key={"workstationpc"}
                >
                  <Link href="/">
                    <p className="h-full flex items-center justify-center">
                      Workstation PC
                    </p>
                  </Link>
                </div>
              </div>
            </li>
            <li key={"customercare"}>
              <p
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setCareToggle(!careToggle);
                  setOfferToggle(false);
                }}
              >
                Customer Care{" "}
                {careToggle ? (
                  <RiArrowDropDownFill size={20} />
                ) : (
                  <RiArrowDropLeftFill size={20} />
                )}
              </p>
              <div
                className={`
                sm:before:absolute sm:before:w-full sm:before:h-full sm:before:backdrop-blur-md sm:before:top-0 sm:before:left-0 sm:before:-z-[10] sm:mt-0
                ${
                  careToggle
                    ? "sm:before:content-['']"
                    : "sm:before:content-none"
                }
                relative py-0 translate-y-0 gap-8 flex flex-col border-white/0
                ${careToggle ? "mt-8" : "mt-0"}
                ${careToggle ? "sm:absolute" : "sm:hidden"}
                sm:primary/30 sm:py-10 sm:px-10 sm:-translate-x-[20%] sm:translate-y-[30%] sm:border-b-[1px] sm:border-white/10`}
              >
                <div
                  className={`
            ${careToggle ? "block" : "hidden"} h-full`}
                  key={"AEON"}
                >
                  <Link href="/">
                    <p className="h-full flex items-center justify-center">
                      AEON
                    </p>
                  </Link>
                </div>
                <div
                  className={`
            ${careToggle ? "block" : "hidden"} h-full`}
                  key={"terms"}
                >
                  <Link href="/">
                    <p className="h-full flex items-center justify-center">
                      Terms and Conditions
                    </p>
                  </Link>
                </div>
              </div>
            </li>
            <li key={"contact"}>
              <Link href="/">
                <p className="h-full flex items-center justify-center">
                  Contact Us
                </p>
              </Link>
            </li>
          </div>
          <RiMenuLine
            color="white"
            size={30}
            className={`sm:hidden ${toggle ? "block" : "hidden"}`}
            onClick={() => {
              setToggle(!toggle);
            }}
          />
          <RiCloseLine
            color="white"
            size={30}
            className={`sm:hidden ${toggle ? "hidden" : "block"}`}
            onClick={() => {
              setToggle(!toggle);
            }}
          />
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
