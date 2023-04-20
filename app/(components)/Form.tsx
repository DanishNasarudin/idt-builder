"use client";

import { useState } from "react";
import { RiArrowDropDownFill, RiArrowDropLeftFill } from "react-icons/ri";

type Props = {};

function Form({}: Props) {
  const [toggle, setToggle] = useState(false);
  return (
    <form>
      <div className="flex gap-4">
        <div className="h-16">
          <label htmlFor="add__label">
            <p>Add</p>
          </label>
          <div
            className="
          mt-4 w-16 h-16 bg-secondary  flex justify-center items-center 
          text-black text-5xl font-bold rounded-2xl
          mobilehover:hover:bg-accent mobilehover:hover:text-secondary cursor-pointer transition-all"
          >
            +
          </div>
        </div>
        <div className="w-full h-16">
          <label htmlFor="product__label">
            <p>Product</p>
          </label>
          <div className="relative h-full">
            <select
              name="product__name"
              id="product__select"
              className="
              mt-4 text-black w-full h-full bg-secondary px-4 py-4 appearance-none cursor-pointer rounded-2xl text-xs whitespace-break-spaces
                "
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              <option value="cpu">CPU</option>
              <option value="i5">Intel i5</option>
              <option value="i7">Intel i7</option>
            </select>
            <RiArrowDropLeftFill
              size={40}
              className={`absolute top-[50%] right-[0] translate-y-[-50%] mt-4 pointer-events-none
              ${toggle ? "hidden" : ""}`}
              color={"black"}
            />
            <RiArrowDropDownFill
              size={40}
              className={`absolute top-[50%] right-[0] translate-y-[-50%] mt-4 pointer-events-none
              ${toggle ? "" : "hidden"}`}
              color={"black"}
            />
          </div>
        </div>
        <div className="h-16 aspect-square">
          <label htmlFor="quantity__label">
            <p>Quantity</p>
          </label>
          <select
            name="quantity__name"
            id="quantity__select"
            className="mt-4 text-black w-full h-full bg-secondary px-4 text-center appearance-none cursor-pointer rounded-2xl"
          >
            <option value="opt1">1</option>
            <option value="opt2">2</option>
            <option value="opt3">3</option>
          </select>
        </div>
        <div className="h-16">
          <label htmlFor="total__label">
            <p>Total</p>
          </label>
          <div className="mt-4">
            <p>RM10,999</p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Form;
