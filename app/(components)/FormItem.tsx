"use client";

import React, { useState } from "react";
import {
  RiAddFill,
  RiArrowDropDownFill,
  RiArrowDropLeftFill,
  RiSubtractFill,
} from "react-icons/ri";

type Props = {
  addRow: (rowIndex: number) => void;
  removeRow: (rowIndex: number) => void;
  rowIndex: number;
  category: string;
  brands: {
    name: string;
    options: { name: string; price: number }[];
  }[];
  added: boolean;
};

function FormItem({
  addRow,
  removeRow,
  rowIndex,
  category,
  brands,
  added,
}: Props) {
  const [toggle, setToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    { name: "", price: 0 } || brands[0]?.options[0]
  );
  const [quantityOption, setQuantityOption] = useState(1);

  const handleAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addRow(rowIndex);
  };

  const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(rowIndex);
    if (rowIndex >= 0) {
      removeRow(rowIndex);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let selected;
    for (const brand of brands) {
      selected = brand.options.find(
        (option) => option.name === event.target.value
      );
      if (selected) break;
    }
    if (selected) {
      setSelectedOption(selected);
    } else if (event.target.value === "notSelected") {
      setSelectedOption({ name: "", price: 0 });
    }
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setQuantityOption(Number(value));
  };

  return (
    <tr className="h-full">
      <td className="h-full pr-2">
        <button
          className="
          mt-4 w-16 h-16 bg-secondary  flex justify-center items-center
          text-black text-5xl font-bold rounded-2xl
          mobilehover:hover:bg-accent mobilehover:hover:text-secondary cursor-pointer transition-all"
          onClick={(event) => {
            added ? handleRemoveRow(event) : handleAddRow(event);
          }}
        >
          {added ? <RiSubtractFill /> : <RiAddFill />}
        </button>
      </td>
      <td className="relative h-full w-[80%] px-2">
        <select
          name="product__name"
          id="product__select"
          className="
              mt-4 text-black w-full h-16 bg-secondary px-4 py-4 appearance-none cursor-pointer rounded-2xl text-xs whitespace-break-spaces
                "
          onClick={() => {
            setToggle(!toggle);
          }}
          onChange={handleOptionChange}
          defaultValue={"notSelected"}
        >
          <option
            value="notSelected"
            className="font-bold text-black"
          >{`Choose your ${category} here`}</option>
          {brands.map((brand, brandIndex) => {
            return (
              <React.Fragment key={brandIndex}>
                <optgroup label={brand.name}>
                  {brand.options.map((option, optionIndex) => {
                    return (
                      <option key={optionIndex} value={option.name}>
                        {option.name} | RM {option.price}
                      </option>
                    );
                  })}
                </optgroup>
              </React.Fragment>
            );
          })}
          <optgroup></optgroup>
        </select>
        <RiArrowDropLeftFill
          size={40}
          className={`absolute top-[50%] right-[0] translate-y-[-50%] mt-2 pointer-events-none
              ${toggle ? "hidden" : ""}`}
          color={"black"}
        />
        <RiArrowDropDownFill
          size={40}
          className={`absolute top-[50%] right-[0] translate-y-[-50%] mt-2 pointer-events-none
              ${toggle ? "" : "hidden"}`}
          color={"black"}
        />
      </td>
      <td className="px-2">
        <select
          name="quantity__name"
          id="quantity__select"
          className="mt-4 text-black w-16 h-16 bg-secondary px-4 text-center appearance-none cursor-pointer rounded-2xl"
          onChange={handleQuantityChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </td>
      <td className="pl-2">
        <div className="mt-4 w-16 h-16 flex justify-center items-center">
          <p>{`RM${selectedOption.price * quantityOption}`}</p>
        </div>
      </td>
    </tr>
  );
}

export default FormItem;
