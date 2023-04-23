"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FormItem from "./FormItem";

interface Products {
  category: string;
  price: string;
}

const initialProducts = [
  {
    id: uuidv4(),
    category: "CPU",
    options: [
      { name: "Intel i5", price: 100 },
      { name: "Intel i7", price: 150 },
    ],
  },
  {
    id: uuidv4(),
    category: "RAM",
    options: [
      { name: "8GB", price: 50 },
      { name: "16GB", price: 80 },
    ],
  },
];

type Props = {};

function Form({}: Props) {
  // const [products, setProducts] = useState([...products]);
  // const [test, setTest] = useState(false);

  const [rows, setRows] = useState(
    initialProducts.map((product) => ({
      ...product,
      id: uuidv4(),
      added: false,
    }))
  );
  // const [addedRows, setAddedRows] = useState<number[]>([]);

  const addRow = (rowIndex: number) => {
    const newRow = { ...rows[rowIndex], id: uuidv4(), added: true };
    rows.splice(rowIndex + 1, 0, newRow);
    setRows([...rows]);
    // setAddedRows([...addedRows, rowIndex + 1]);
  };

  const removeRow = (rowIndex: number) => {
    if (rowIndex >= 0) {
      rows.splice(rowIndex, 1);
      setRows([...rows]);
      // setAddedRows(addedRows.filter((row) => row !== rowIndex));
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
                  key={row.id}
                  rowIndex={index}
                  addRow={addRow}
                  removeRow={removeRow}
                  category={row.category}
                  options={row.options}
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
