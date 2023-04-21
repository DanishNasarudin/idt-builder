"use client";

import { useState } from "react";
import FormItem from "./FormItem";

type Props = {};

function Form({}: Props) {
  const [toggle, setToggle] = useState(false);
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
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
            <FormItem />
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default Form;
