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
  selectedProduct: {
    name: string;
    price: number;
    oriPrice: number;
  };
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
  selectedProduct,
}: Props) {
  const [toggle, setToggle] = useState(false);
  const [searchSelectedProduct, setSearchSelectedProduct] = useState(
    { name: "", price: 0, oriPrice: 0 } || brands[0]?.options[0]
  );
  const [selectedOption, setSelectedOption] = useState(
    searchSelectedProduct || { name: "", price: 0, oriPrice: 0 } ||
      brands[0]?.options[0]
  );
  const [currentValue, setCurrentValue] = useState("notSelected");
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
      if (event.target.value === selected.name) {
        setCurrentValue(event.target.value);
      }
      selected = { name: "", price: 0, oriPrice: 0 };
    } else if (event.target.value === "notSelected") {
      setSelectedOption({ name: "", price: 0, oriPrice: 0 });
      setCurrentValue(event.target.value);
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
  }, [selectedOption, quantityOption, rowIndex]);

  useEffect(() => {
    brands.forEach((brand) => {
      brand.options.forEach((option) => {
        if (option.name === selectedProduct.name) {
          setSelectedOption(selectedProduct);
          setCurrentValue(selectedProduct.name);
        }
      });
    });
    if (selectedOption !== selectedProduct) {
      // setSelectedOption(selectedProduct);
      // console.log(selectedOption, "option pass");
      // console.log(selectedProduct, "select pass");
    }
  }, [selectedProduct]);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setTooltipVisible(true);
    setTimeout(() => {
      setTooltipVisible(false);
    }, 1000);

    if (quantityOption === 1) {
      const copyText = `${selectedOption.name
        .replace(/\([^)]*\)/g, "")
        .trim()}, Price: RM${selectedOption.price}`;
      navigator.clipboard.writeText(copyText);
    } else {
      const copyText = `${selectedOption.name
        .replace(/\([^)]*\)/g, "")
        .trim()}, Price: RM${
        selectedOption.price
      }, Qty: x${quantityOption}, Total: RM${
        selectedOption.price * quantityOption
      }`;
      navigator.clipboard.writeText(copyText);
    }
  };

  return (
    <tr className="h-full">
      <td className="relative pr-2 hidden sm:table-cell h-0 m-0 p-0">
        <button
          className="
          mt-0 w-10 h-10 bg-secondary  flex justify-center items-center
          text-black text-xl font-bold rounded-lg
          mobilehover:hover:bg-accent mobilehover:hover:text-secondary cursor-pointer transition-all"
          onClick={(event) => {
            added ? handleRemoveRow(event) : handleAddRow(event);
          }}
        >
          {added ? <RiSubtractFill /> : <RiAddFill />}
        </button>
        <button
          className={`
            absolute right-[100%] top-[4px]
            mt-0 mr-4 w-10 h-10  text-secondary rounded-lg font-bold
            mobilehover:hover:bg-zinc-900/80 mobilehover:hover:text-secondary/80 transition-all
            ${tooltipVisible ? "bg-green-600" : "bg-zinc-900"}
            ${selectedOption.name === "" ? "hidden" : ""}`}
          onClick={(event) => handleCopy(event)}
        >
          <p className="text-[10px]">Copy</p>
        </button>
      </td>
      <td className="relative  w-full sm:w-[80%] px-2 block sm:table-cell ">
        <label
          htmlFor="category__label"
          className="flex items-center gap-4 sm:hidden mt-4 w-full"
        >
          <h5 className="text-accent w-[80%]">
            <b>{category}</b>
          </h5>
          {/* <div className="border-b-[1px] border-secondary w-full" /> */}
        </label>
        <select
          name="product__name"
          id="product__select"
          className="
              mt-2 sm:mt-0 text-black font-bold w-full h-14 sm:h-10 bg-secondary px-4 py-0 appearance-none cursor-pointer rounded-lg text-[10px] whitespace-break-spaces
                "
          onClick={() => {
            setToggle(!toggle);
          }}
          onChange={handleOptionChange}
          value={currentValue}
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
          className={`absolute top-[50%] sm:right-[0] right-2 sm:translate-y-[-50%] translate-y-[-0%] mt-0 sm:mt-0 pointer-events-none text-black
              ${toggle ? "hidden" : ""}`}
        />
        <RiArrowDropDownFill
          size={40}
          className={`absolute top-[50%] sm:right-[0] right-2 sm:translate-y-[-50%] translate-y-[-0%] mt-0 sm:mt-0 pointer-events-none text-black
              ${toggle ? "" : "hidden"}`}
        />
      </td>
      <td className="relative px-2 hidden sm:table-cell">
        <select
          name="quantity__name"
          id="quantity__select"
          className=" mt-0 text-black w-10 h-10 bg-secondary px-4 text-center appearance-none cursor-pointer rounded-lg"
          onChange={handleQuantityChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </td>
      <td className="pl-2 block">
        <div className="bg-secondary mr-2 mt-2 py-2 rounded-lg text-zinc-900 flex sm:hidden px-4">
          <div className="relative flex justify-between max-w-[250px] w-full mx-auto sm:mb-0 ">
            <div className="flex sm:hidden flex-col text-center items-center">
              <label htmlFor="add__label">
                <p style={{ fontSize: 10 }}>
                  <b>{added ? "Delete" : "Add"}</b>
                </p>
              </label>
              <button
                className="
                mt-1 w-7 h-7 bg-secondary flex sm:hidden justify-center items-center border-[2px] border-zinc-900
                 text-5xl font-bold rounded-md
                mobilehover:hover:bg-accent mobilehover:hover:text-secondary cursor-pointer transition-all"
                onClick={(event) => {
                  added ? handleRemoveRow(event) : handleAddRow(event);
                }}
              >
                {added ? <RiSubtractFill /> : <RiAddFill />}
              </button>
            </div>
            <div className="flex sm:hidden flex-col text-center items-center">
              <label htmlFor="quantity__label">
                <p style={{ fontSize: 10 }}>
                  <b>Quantity</b>
                </p>
              </label>
              <select
                name="quantity__name"
                id="quantity__select"
                className="flex sm:hidden mt-1  w-7 h-7 bg-secondary px-0 text-center appearance-none cursor-pointer rounded-md border-[2px] border-zinc-900 font-bold"
                onChange={handleQuantityChange}
                style={{ textAlignLast: "center" }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </div>
            <div className="flex sm:hidden flex-col text-center ">
              <label htmlFor="total__label">
                <p style={{ fontSize: 10 }}>
                  <b>Total</b>
                </p>
              </label>
              <div
                className={`mt-1 w-7 h-7 flex justify-center items-center font-bold
              ${
                selectedOption.oriPrice - selectedOption.price > 0
                  ? "text-green-600"
                  : ""
              }`}
              >
                <p>{`RM${selectedOption.price * quantityOption}`}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`mt-2 w-10 h-10 hidden sm:flex justify-center items-center
        ${
          selectedOption.oriPrice - selectedOption.price > 0
            ? "text-green-400 font-bold"
            : ""
        }`}
        >
          <p>{`RM${selectedOption.price * quantityOption}`}</p>
        </div>
      </td>
    </tr>
  );
}

export default FormItem;
