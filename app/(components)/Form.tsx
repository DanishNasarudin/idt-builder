"use client";

import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FormItem from "./FormItem";
import readFileAndParse from "./TxtToProduct";

// const initialProductsTest = readFileAndParse();
// // const initialProducts: any = [];
// initialProductsTest.then((value) => {
//   const initialProducts = value;
//   console.log(initialProducts, "value");
// });

type OptionType = {
  name: string;
  price: number;
};

type BrandType = {
  name: string;
  options: OptionType[];
};

type ProductType = {
  category: string;
  brands: BrandType[];
};

// const initialProducts: ProductType[] = [];

// readFileAndParse().then((value) => {
//   value.forEach((product) => {
//     initialProducts.push(product);
//   });
//   console.log(initialProducts, "array");
// });

// console.log(initialProducts);
// async function handlePromise () {
//   const readProduct = readFileAndParse();
//   const initial = await readProduct;

//   return initial
// }
// handlePromise();

// console.log(initialProducts, "text");

// const initialProducts = [
//   {
//     category: "CPU",
//     brands: [
//       {
//         name: "FOC Contact Frame for 13th Gen Only!",
//         options: [],
//       },
//       {
//         name: "",
//         options: [],
//       },
//       {
//         name: "12th Gen CPU",
//         options: [
//           { name: "Intel i5", price: 100 },
//           { name: "Intel i7", price: 150 },
//         ],
//       },
//       {
//         name: "",
//         options: [],
//       },
//       {
//         name: "13th Gen CPU",
//         options: [
//           { name: "Intel i5", price: 200 },
//           { name: "Intel i7", price: 250 },
//         ],
//       },
//     ],
//   },
//   {
//     category: "RAM",
//     brands: [
//       {
//         name: "RAM Brand 1",
//         options: [
//           { name: "8GB", price: 50 },
//           { name: "16GB", price: 80 },
//         ],
//       },
//     ],
//   },
//   {
//     category: "GPU",
//     brands: [
//       {
//         name: "GPU Brand 1",
//         options: [
//           { name: "RTX4070", price: 350 },
//           { name: "RTX4090", price: 380 },
//         ],
//       },
//     ],
//   },
// ];
// console.log(initialProducts, "value");
type Props = {};

export interface FormDataItem {
  category: string;
  selectedOption: { name: string; price: number };
  quantity: number;
  total: number;
}

function Form({}: Props) {
  const [initialProducts, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    readFileAndParse().then((data) => {
      setProducts(data);
    });
  }, []);

  // console.log(initialProducts);

  useEffect(() => {
    setRows(
      initialProducts.map((product) => ({
        ...product,
        added: false,
        totalPrice: 0,
        id: uuidv4(),
      }))
    );
  }, [initialProducts]);

  // if (!mainData) {
  //   return (
  //     <h2 className="flex flex-col justify-center items-center h-[100vh] text-center">
  //       Loading...
  //     </h2>
  //   );
  // }

  // console.log("firestore", mainData?.docs[0].data().data);
  // console.log("original", initialProducts);

  const [rows, setRows] = useState(
    initialProducts.map((product) => ({
      ...product,
      added: false,
      totalPrice: 0,
      id: uuidv4(),
    }))
  );
  // console.log(rows);

  const addRow = (rowIndex: number) => {
    const newRow = { ...rows[rowIndex], added: true, id: uuidv4() };
    rows.splice(rowIndex + 1, 0, newRow);
    setRows([...rows]);
  };

  const removeRow = (rowIndex: number) => {
    if (rowIndex >= 0) {
      const rowTotalPrice = rows[rowIndex].totalPrice;
      setTotalPrice(totalPrice - rowTotalPrice); // Subtract row's total price from the grand total
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

  const resetForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRows(
      initialProducts.map((product) => ({
        ...product,
        added: false,
        totalPrice: 0,
        id: uuidv4(),
      }))
    );
    setTotalPrice(0);
  };

  const deleteOldestDocuments = async () => {
    const quoteIdsRef = collection(db, "quote__ids");
    const q = query(quoteIdsRef, orderBy("createdAt"), limit(250));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "quote__ids", docSnapshot.id));
    });
  };

  const [formData, setFormData] = useState<FormDataItem[]>([]);

  // console.log(formData);

  const router = useRouter();
  const createNewQuote = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Filter out undefined values from formData
    const filteredFormData = formData.filter(
      (item) => item !== undefined && item.selectedOption.name !== ""
    );

    const id = uuidv4();
    await setDoc(doc(db, "quote__ids", id), {
      formData: filteredFormData, // Add filteredFormData to the document
      grandTotal: totalPrice,
      createdAt: serverTimestamp(),
    });

    // Check the total number of documents in the collection
    const quoteIdsSnapshot = await getDocs(collection(db, "quote__ids"));
    if (quoteIdsSnapshot.size >= 500) {
      // Delete the first 250 documents ordered by createdAt
      await deleteOldestDocuments();
    }

    router.push(`/quote/${id}`);
  };

  return (
    <div className="py-8">
      <div className="text-center mb-4">
        <h2>Choose your parts</h2>
      </div>
      <form className="w-full">
        <table className="w-full">
          <thead className="hidden sm:table-header-group">
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
                  updateFormData={(rowIndex, rowData) => {
                    const newFormData = [...formData];
                    newFormData[rowIndex] = rowData;
                    setFormData(newFormData);
                  }}
                />
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0">
            <tr className="sticky">
              <td className="hidden sm:table-cell"></td>
              {/* <td className="hidden sm:table-cell"></td> */}
              <td className="h-full pr-2 hidden sm:table-cell">
                <div className="flex flex-col items-end justify-between h-32 mt-4">
                  <button
                    className="
                  py-4 px-8 bg-secondary text-black rounded-2xl w-28
                  mobilehover:hover:bg-secondary/80 transition-all"
                  >
                    <p>
                      <b>Reset</b>
                    </p>
                  </button>
                  <button
                    onClick={(event) => createNewQuote(event)}
                    className="
                    py-4 px-8 bg-accent text-secondary rounded-2xl w-28
                    mobilehover:hover:bg-accent/50 transition-all"
                  >
                    <p>
                      <b>Next</b>
                    </p>
                  </button>
                </div>
              </td>
              <td colSpan={2} className="pl-2 block sm:table-cell">
                <div
                  className="
                flex max-w-[300px] justify-between mx-auto
                sm:w-full"
                >
                  <div className="flex sm:hidden flex-col items-end justify-between h-32 mt-4">
                    <button
                      className="
                      py-4 px-8 bg-secondary text-black rounded-2xl w-28 shadow-2xl
                      mobilehover:hover:bg-secondary/80 transition-all"
                      onClick={(event) => resetForm(event)}
                    >
                      <p>
                        <b>Reset</b>
                      </p>
                    </button>
                    <button
                      onClick={(event) => createNewQuote(event)}
                      className="
                      py-4 px-8 bg-accent text-secondary rounded-2xl w-28 shadow-2xl
                      mobilehover:hover:bg-accent/50 transition-all"
                    >
                      <p>
                        <b>Next</b>
                      </p>
                    </button>
                  </div>
                  <div
                    className="
                  bg-secondary w-[50%] text-black rounded-2xl h-32 mt-4 flex justify-center items-center flex-col gap-2
                  shadow-2xl
                  sm:w-full"
                  >
                    <p>
                      <b>Grand Total</b>
                    </p>
                    <div className="border-b-[1px] border-black w-[70%]" />
                    <p>
                      <b>RM {totalPrice}</b>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
  );
}

export default Form;
