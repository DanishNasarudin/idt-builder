"use client";

import { useState } from "react";
import FormItem from "./FormItem";

const initialProducts = [
  {
    category: "CPU",
    brands: [
      {
        name: "FOC Contact Frame for 13th Gen Only!",
        options: [],
      },
      {
        name: "",
        options: [],
      },
      {
        name: "12th Gen CPU",
        options: [
          { name: "Intel i5", price: 100 },
          { name: "Intel i7", price: 150 },
        ],
      },
      {
        name: "",
        options: [],
      },
      {
        name: "13th Gen CPU",
        options: [
          { name: "Intel i5", price: 200 },
          { name: "Intel i7", price: 250 },
        ],
      },
    ],
  },
  {
    category: "RAM",
    brands: [
      {
        name: "RAM Brand 1",
        options: [
          { name: "8GB", price: 50 },
          { name: "16GB", price: 80 },
        ],
      },
    ],
  },
];

type Props = {};

function Form({}: Props) {
  const [rows, setRows] = useState(
    initialProducts.map((product) => ({
      ...product,
      added: false,
    }))
  );

  const addRow = (rowIndex: number) => {
    const newRow = { ...rows[rowIndex], added: true };
    rows.splice(rowIndex + 1, 0, newRow);
    setRows([...rows]);
  };

  const removeRow = (rowIndex: number) => {
    if (rowIndex >= 0) {
      rows.splice(rowIndex, 1);
      setRows([...rows]);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-4">
        <h2>Choose your parts</h2>
      </div>
      <form>
        <table className="w-full">
          <thead>
            <tr>
              <th>
                <label htmlFor="add__label">
                  <p>Add</p>
                </label>
              </th>
              <th className="text-left pl-2">
                <label htmlFor="product__label">
                  <p>Product</p>
                </label>
              </th>
              <th>
                <label htmlFor="quantity__label">
                  <p>Quantity</p>
                </label>
              </th>
              <th>
                <label htmlFor="total__label">
                  <p>Total</p>
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              return (
                <FormItem
                  key={index}
                  rowIndex={index}
                  addRow={addRow}
                  removeRow={removeRow}
                  category={row.category}
                  brands={row.brands}
                  added={row.added}
                />
              );
            })}
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default Form;
