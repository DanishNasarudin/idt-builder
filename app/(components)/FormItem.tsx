"use client";

import React, { useEffect, useState } from "react";
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
    options: { name: string; price: number; oriPrice: number }[];
  }[];
  added: boolean;
  updateGrandTotal: (
    newTotalPrice: number,
    newTotalOriPrice: number,
    rowIndex: number
  ) => void;
  updateFormData: (
    rowIndex: number,
    rowData: {
      category: string;
      selectedOption: { name: string; price: number };
      quantity: number;
      total: number;
    }
  ) => void;
};

function FormItem({
  addRow,
  removeRow,
  rowIndex,
  category,
  brands,
  added,
  updateGrandTotal,
  updateFormData,
}: Props) {
  const [toggle, setToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    { name: "", price: 0, oriPrice: 0 } || brands[0]?.options[0]
  );
  const [quantityOption, setQuantityOption] = useState(1);

  const handleAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    addRow(rowIndex);
  };

  const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
      setSelectedOption({ name: "", price: 0, oriPrice: 0 });
    }
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setQuantityOption(Number(value));
  };

  useEffect(() => {
    updateGrandTotal(
      selectedOption.price * quantityOption,
      selectedOption.oriPrice * quantityOption,
      rowIndex
    );
    updateFormData(rowIndex, {
      category,
      selectedOption,
      quantity: quantityOption,
      total: selectedOption.price * quantityOption,
    });
  }, [selectedOption, quantityOption]);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setTooltipVisible(true);
    setTimeout(() => {
      setTooltipVisible(false);
    }, 1000);

    if (quantityOption === 1) {
      const copyText = `${selectedOption.name}, Price: RM${selectedOption.price}
      `;
      navigator.clipboard.writeText(copyText);
    } else {
      const copyText = `${selectedOption.name}, Price: RM${
        selectedOption.price
      }, Qty: x${quantityOption}, Total: RM${
        selectedOption.price * quantityOption
      }`;
      navigator.clipboard.writeText(copyText);
    }
  };

  return (
    <tr className="h-full">
      <td className="relative h-full pr-2 hidden sm:table-cell">
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
        <button
          className={`
            absolute right-[100%] top-0
            mt-4 mr-4 w-16 h-16  text-secondary rounded-xl font-bold
            mobilehover:hover:bg-zinc-900/80 mobilehover:hover:text-secondary/80 transition-all
            ${tooltipVisible ? "bg-green-600" : "bg-zinc-900"}
            ${selectedOption.name === "" ? "hidden" : ""}`}
          onClick={(event) => handleCopy(event)}
        >
          <p>Copy</p>
        </button>
      </td>
      <td className="relative h-full w-full sm:w-[80%] px-2 block sm:table-cell">
        <label
          htmlFor="category__label"
          className="flex items-center gap-4 sm:hidden mt-4"
        >
          <h5 className="text-accent">
            <b>{category}</b>
          </h5>
          <div className="border-b-[1px] border-secondary w-full" />
        </label>
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
          className={`absolute top-[50%] sm:right-[0] right-2 sm:translate-y-[-50%] translate-y-[-0%] mt-2 pointer-events-none
              ${toggle ? "hidden" : ""}`}
          color={"black"}
        />
        <RiArrowDropDownFill
          size={40}
          className={`absolute top-[50%] sm:right-[0] right-2 sm:translate-y-[-50%] translate-y-[-0%] mt-2 pointer-events-none
              ${toggle ? "" : "hidden"}`}
          color={"black"}
        />
      </td>
      <td className="px-2 hidden sm:table-cell">
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
      <td className="pl-2 block">
        <div className="relative flex justify-between max-w-[300px] mx-auto mb-8 sm:mb-0">
          <div className="flex sm:hidden flex-col text-center mt-4">
            <label htmlFor="add__label">
              <p>
                <b>Add</b>
              </p>
            </label>
            <button
              className="
              mt-4 w-16 h-16 bg-secondary flex sm:hidden justify-center items-center
              text-black text-5xl font-bold rounded-2xl
              mobilehover:hover:bg-accent mobilehover:hover:text-secondary cursor-pointer transition-all"
              onClick={(event) => {
                added ? handleRemoveRow(event) : handleAddRow(event);
              }}
            >
              {added ? <RiSubtractFill /> : <RiAddFill />}
            </button>
          </div>
          <div className="flex sm:hidden flex-col text-center mt-4">
            <label htmlFor="quantity__label">
              <p>
                <b>Quantity</b>
              </p>
            </label>
            <select
              name="quantity__name"
              id="quantity__select"
              className="flex sm:hidden mt-4 text-black w-16 h-16 bg-secondary px-4 text-center appearance-none cursor-pointer rounded-2xl"
              onChange={handleQuantityChange}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <div className="flex sm:hidden flex-col text-center mt-4">
            <label htmlFor="total__label">
              <p>
                <b>Total</b>
              </p>
            </label>
            <div className="mt-4 w-16 h-16 flex justify-center items-center">
              <p>{`RM${selectedOption.price * quantityOption}`}</p>
            </div>
          </div>
          <div className="mt-4 w-16 h-16 hidden sm:flex justify-center items-center">
            <p>{`RM${selectedOption.price * quantityOption}`}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FormItem;
