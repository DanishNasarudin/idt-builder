"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  {
    category: "GPU",
    brands: [
      {
        name: "GPU Brand 1",
        options: [
          { name: "RTX4070", price: 350 },
          { name: "RTX4090", price: 380 },
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
      totalPrice: 0,
      id: uuidv4(),
    }))
  );

  const addRow = (rowIndex: number) => {
    const newRow = { ...rows[rowIndex], added: true, id: uuidv4() };
    rows.splice(rowIndex + 1, 0, newRow);
    setRows([...rows]);
  };

  const removeRow = (rowIndex: number) => {
    if (rowIndex >= 0) {
      rows.splice(rowIndex, 1);
      setRows([...rows]);
    }
  };

  const [totalPrice, setTotalPrice] = useState(0);

  const updateGrandTotal = (newTotalPrice: number, rowIndex: number) => {
    const updatedRows = [...rows];

    updatedRows[rowIndex].totalPrice = newTotalPrice;

    const newGrandTotalPrice = updatedRows.reduce(
      (sum, row) => sum + row.totalPrice,
      0
    );

    setTotalPrice(newGrandTotalPrice);
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
                  key={row.id}
                  rowIndex={index}
                  addRow={addRow}
                  removeRow={removeRow}
                  category={row.category}
                  brands={row.brands}
                  added={row.added}
                  updateGrandTotal={updateGrandTotal}
                />
              );
            })}
            <tr>
              <td></td>
              <td></td>
              <td>
                <p>
                  <b>Grand Total: </b>
                </p>
              </td>
              <td>
                <p>
                  <b>RM {totalPrice}</b>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default Form;
