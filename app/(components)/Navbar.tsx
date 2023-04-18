"use client";

import Link from "next/link";
import { useState } from "react";
import { RiCloseLine, RiMenuLine } from "react-icons/ri";

type Props = {};

function Navbar({}: Props) {
  const [toggle, setToggle] = useState(true);
  return (
    <nav className="bg-primary backdrop-blur-sm sticky top-0">
      <ul className="flex justify-between items-center w-4/5 mx-auto text-xs py-2">
        <Link href="/">
          <img
            src="https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png"
            alt="logo"
            className="w-10"
          />
        </Link>
        <div
          className={`
            ${
              toggle ? "hidden" : "flex"
            } flex-col absolute bg-primary top-[100%] w-full text-center gap-4 py-8 left-0 
            sm:relative sm:flex sm:flex-row sm:justify-evenly sm:w-full`}
        >
          <li className="">
            <Link href="/">
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link href="/">
              <p>About</p>
            </Link>
          </li>
          <li>
            <Link href="/">
              <p>Special Offer</p>
            </Link>
          </li>
          <li>
            <Link href="/">
              <p>Customer Care</p>
            </Link>
          </li>
          <li>
            <Link href="/">
              <p>Contact Us</p>
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
    </nav>
  );
}

export default Navbar;
