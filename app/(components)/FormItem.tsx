"use client";

import { useState } from "react";
import { RiArrowDropDownFill, RiArrowDropLeftFill } from "react-icons/ri";

type Props = {
  addRow: (rowIndex: number) => void;
  removeRow: (rowIndex: number) => void;
  rowIndex: number;
  category: string;
  options: { name: string; price: number }[];
  added: boolean;
};

function FormItem({
  addRow,
  removeRow,
  rowIndex,
  category,
  options,
  added,
}: Props) {
  const [toggle, setToggle] = useState(false);
  // const [isAdded, setIsAdded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // setIsAdded(true);
    addRow(rowIndex);
  };

  const handleRemoveRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(rowIndex);
    if (rowIndex >= 0) {
      // setIsAdded(false);
      removeRow(rowIndex);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find(
      (option) => option.name === event.target.value
    );
    if (selected) setSelectedOption(selected);
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
          {added ? "-" : "+"}
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
        >
          <optgroup label={`Choose your ${category} here`}>
            {options.map((option, index) => {
              return (
                <option key={index} value={option.name}>
                  {rowIndex + option.name}
                </option>
              );
            })}
          </optgroup>
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
        >
          <option value="opt1">1</option>
          <option value="opt2">2</option>
          <option value="opt3">3</option>
        </select>
      </td>
      <td className="pl-2">
        <div className="mt-4 h-16 flex items-center">
          <p>{`RM${selectedOption.price}`}</p>
        </div>
      </td>
    </tr>
  );
}

export default FormItem;
