"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useScrollListener } from "../(hooks)/useScrollListener";
import { useUserSelected } from "../../lib/zus-store";
import FormItem from "./FormItem";
import { deleteOldestFiles, queueWrite } from "./QuoteDataJSON";
import readFileAndParse from "./TxtToProduct";

type OptionType = {
  name: string;
  oriPrice: number;
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
        totalOriPrice: 0,
        id: uuidv4(),
      }))
    );
    setFormData([]);
    setSearchTerm("");
    setSelectedProduct({ name: "", price: 0, oriPrice: 0 });
  }, [initialProducts]);

  const [rows, setRows] = useState(
    initialProducts.map((product) => ({
      ...product,
      added: false,
      totalPrice: 0,
      totalOriPrice: 0,
      id: uuidv4(),
    }))
  );
  // console.log(rows);

  const addRow = (rowIndex: number) => {
    // console.log({ ...rows[rowIndex] }, "check2");
    const newRow = { ...rows[rowIndex], added: true, id: uuidv4() };

    // console.log({ ...formData[rowIndex] }, "check row");
    rows.splice(rowIndex + 1, 0, newRow);
    setRows([...rows]);

    const newFormData = { ...formData[rowIndex] };
    formData.splice(rowIndex + 1, 0, newFormData);
    setFormData([...formData]);

    // const newFormData = [...formData];
    // console.log(newFormData, "check");
  };
  // console.log(rows, "check2");

  const removeRow = (rowIndex: number) => {
    if (rowIndex >= 0) {
      const rowTotalPrice = rows[rowIndex].totalPrice;
      setTotalPrice(totalPrice - rowTotalPrice); // Subtract row's total price from the grand total
      rows.splice(rowIndex, 1);
      setRows([...rows]);
      formData.splice(rowIndex, 1);
      setFormData([...formData]);
    }
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalOriPrice, setTotalOriPrice] = useState(0);

  const updateGrandTotal = (
    newTotalPrice: number,
    newTotalOriPrice: number,
    rowIndex: number
  ) => {
    const updatedRows = [...rows];

    updatedRows[rowIndex].totalPrice = newTotalPrice;
    updatedRows[rowIndex].totalOriPrice = newTotalOriPrice;

    const newGrandTotalPrice = updatedRows.reduce(
      (sum, row) => sum + row.totalPrice,
      0
    );

    setTotalPrice(newGrandTotalPrice);

    const newGrandTotalOriPrice = updatedRows.reduce(
      (sum, row) => sum + row.totalOriPrice,
      0
    );

    setTotalOriPrice(newGrandTotalOriPrice);
  };

  const resetForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRows(
      initialProducts.map((product) => ({
        ...product,
        added: false,
        totalPrice: 0,
        totalOriPrice: 0,
        id: uuidv4(),
      }))
    );
    setTotalPrice(0);
    setFormData([]);
    setSearchTerm("");
    setSelectedProduct({ name: "", price: 0, oriPrice: 0 });
  };

  // const deleteOldestDocuments = async () => {
  //   const quoteIdsRef = collection(db, "quote__ids");
  //   const q = query(quoteIdsRef, orderBy("createdAt"), limit(250));
  //   const querySnapshot = await getDocs(q);

  //   querySnapshot.forEach(async (docSnapshot) => {
  //     await deleteDoc(doc(db, "quote__ids", docSnapshot.id));
  //   });
  // };

  const [formData, setFormData] = useState<FormDataItem[]>([]);

  // console.log(formData, "check");
  // console.log(rows, "check2");

  // console.log(formData[0] === undefined);

  // const openInNewTab = (url: string) => {
  //   const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  //   if (newWindow) newWindow.opener = null;
  // };
  // const router = useRouter();
  // const createNewQuote = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   // Filter out undefined values from formData
  //   const filteredFormData = formData.filter(
  //     (item) => item !== undefined && item.selectedOption.name !== ""
  //   );

  //   const id = uuidv4();
  //   await setDoc(doc(db, "quote__ids", id), {
  //     formData: filteredFormData, // Add filteredFormData to the document
  //     grandTotal: totalPrice,
  //     oriTotal: totalOriPrice,
  //     //grand total ori - discount
  //     createdAt: serverTimestamp(),
  //   });

  //   // Check the total number of documents in the collection
  //   const quoteIdsSnapshot = await getDocs(collection(db, "quote__ids"));
  //   if (quoteIdsSnapshot.size >= 500) {
  //     // Delete the first 250 documents ordered by createdAt
  //     await deleteOldestDocuments();
  //   }

  //   // router.push(`/quote/${id}`);

  //   openInNewTab(
  //     `${window.location.protocol}//${window.location.host}/quote/${id}`
  //   );
  // };

  // ----- json data

  // console.log(rows, "Check");

  const userSelected = useUserSelected((state) => state.selected);
  const setUserSelected = useUserSelected((state) => state.changeSelected);

  const [createQuoteLoad, setCreateQuoteLoad] = useState(false);

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const createNewQuoteJSON = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    setCreateQuoteLoad(true);

    let quoteWindow;
    if (isSafari) {
      // Open a blank window immediately on user interaction for Safari
      quoteWindow = window.open("about:blank", "_blank");
    }

    // Filter out undefined values from formData
    const filteredFormData = formData.filter(
      (item) => item !== undefined && item.selectedOption.name !== ""
    );

    const id = uuidv4();
    // const currentData = await readData();

    const newQuote = {
      id,
      formData: filteredFormData,
      grandTotal: totalPrice,
      oriTotal: totalOriPrice,
      createdAt: new Date().toISOString(),
    };

    // currentData.push(newQuote);

    // // Ensure we don't exceed 20000 quotes
    // if (currentData.length > 20000) {
    //   currentData.splice(0, 10000); // Remove the oldest 10000 quotes
    // }

    // console.log(newQuote, "CHECK");

    setUserSelected(newQuote);

    // console.log(userSelected, "CHANGE");

    await queueWrite(newQuote, id);

    // After writing the new quote file, call the cleanup function
    await deleteOldestFiles(20000);

    setTimeout(() => {
      setCreateQuoteLoad(false);
    }, 1000);

    const quoteUrl = `${window.location.protocol}//${window.location.host}/quote/${id}`;

    if (isSafari && quoteWindow) {
      quoteWindow.location.href = quoteUrl;
    } else {
      // For other browsers, open the window after the async operation
      window.open(quoteUrl, "_blank");
    }

    // Navigate to the new quote page
    // window.open(
    //   `${window.location.protocol}//${window.location.host}/quote/${id}`,
    //   "_blank"
    // );
  };

  // ------ clear the link from google analytics

  const router = useRouter();
  let pathname = "";

  if (typeof window !== "undefined") {
    pathname = String(window.location.search);
  }
  useEffect(() => {
    // // List of common Google Analytics parameters - remove them

    // console.log(
    //   pathname.includes("_ga") || pathname.includes("_gl"),
    //   "checkfinal"
    // );

    if (pathname.includes("_ga") || pathname.includes("_gl")) {
      router.replace("/");
      // console.log("pass");
    }
  }, [pathname]);

  // ------ top bar

  const scroll2 = useScrollListener();
  const [hideNavbar, setHideNavbar] = useState(false);
  const [hideNavbar2, setHideNavbar2] = useState(false);

  useEffect(() => {
    if (scroll2.checkY > 0) {
      setHideNavbar(true);
    } else if (scroll2.checkY < 0) {
      setHideNavbar(false);
    }
    if (scroll2.y > 200) {
      setHideNavbar2(true);
    } else if (scroll2.y < 200) {
      setHideNavbar2(false);
    }
  }, [scroll2.y, scroll2.lastY]);

  // console.log(rows.some((item) => item.totalPrice > 0 === true));

  // ----- Search bar

  const [searchTerm, setSearchTerm] = useState("");

  type FlattenedProduct = {
    category: string;
    brandName: string;
    option: OptionType;
  };

  const flattenProducts = (): FlattenedProduct[] => {
    let flattened: FlattenedProduct[] = [];

    initialProducts.forEach((product) => {
      product.brands.forEach((brand) => {
        brand.options.forEach((option) => {
          flattened.push({
            category: product.category,
            brandName: brand.name,
            option: option,
          });
        });
      });
    });

    return flattened;
  };

  const flattened = flattenProducts();

  const filteredProducts = flattened.filter((product) => {
    const terms = searchTerm.split(" ");
    return terms.every(
      (term) =>
        product.option.name.toLowerCase().includes(term.toLowerCase()) &&
        searchTerm !== product.option.name
    );
  });

  const handleSearchSelect = (term: string) => {
    handleSearchSelectForm(term);
    setSearchTerm(term);
    // console.log(term, "search");
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(e.key, "Check Key");
    if (e.key == "Enter") {
      const target = e.target as HTMLInputElement;
      handleSearchSelectForm(target.value);
      // console.log(target.value, "Entered");
    }
  };

  const [selectedProduct, setSelectedProduct] = useState<OptionType>({
    name: "",
    oriPrice: 0,
    price: 0,
  });

  const handleSearchSelectForm = (term: string) => {
    initialProducts.forEach((product) => {
      product.brands.forEach((brand) => {
        brand.options.forEach((option) => {
          if (term === option.name) {
            setSelectedProduct({
              ...option,
              name: option.name,
              price: option.price,
              oriPrice: option.oriPrice,
            });
          }
        });
      });
    });
  };

  const [searchFocus, setSearchFocus] = useState(false);

  // console.log(selectedProduct, "check");

  // console.log(filteredProducts, "after filter");

  // console.log("pass");

  return (
    <div className="py-8">
      <div className="absolute top-0 h-[100%] left-0 w-full">
        <div
          className={`z-[1] sticky transition-all bg-primary/80 border-b-[1px] border-[#323232]
          ${hideNavbar ? "top-0" : "top-[72px] sm:top-[103px]"}
          
          before:absolute before:w-full before:h-full before:content-[''] before:backdrop-blur-md before:top-0 before:-z-10`}
        >
          <div className="relative max-w-[1060px] mx-auto py-2">
            <div className="w-4/5 mx-auto flex justify-between items-center ">
              <div className="flex flex-col sm:flex-row justify-center w-full">
                <div className="flex items-center  w-full justify-between">
                  <div className="flex gap-8 items-center ">
                    <div>
                      <button
                        className="py-2 px-4 sm:py-4 sm:px-8 border-white border-[1px] rounded-lg text-xs"
                        onClick={(event) => resetForm(event)}
                      >
                        <p className="text-[10px] sm:text-sm">
                          <b>Reset</b>
                        </p>
                      </button>
                    </div>
                    <div className="text-center sm:text-left hidden sm:block">
                      {totalOriPrice - totalPrice > 0 ? (
                        <p className="text-[10px] text-gray-400">
                          <b>
                            <s>RM {totalOriPrice}</s>
                          </b>
                        </p>
                      ) : (
                        ""
                      )}
                      <p>
                        <b>RM {totalPrice}</b>
                      </p>
                      {totalOriPrice - totalPrice > 0 ? (
                        <p className="text-[10px] text-accent">
                          <b>Save RM {totalOriPrice - totalPrice}</b>
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="sm:flex hidden">
                      {totalPrice > 0 ? (
                        <p className="text-[10px]">
                          Starting from <br />{" "}
                          <b className="text-accent">
                            {Math.floor(totalPrice / (1 - 0.04) / 12)}/mo
                          </b>{" "}
                          <br /> with listed Bank.
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="text-center sm:text-left block sm:hidden">
                    {totalOriPrice - totalPrice > 0 ? (
                      <p className="text-[10px] text-gray-400">
                        <b>
                          <s>RM {totalOriPrice}</s>
                        </b>
                      </p>
                    ) : (
                      ""
                    )}
                    <p>
                      <b>RM {totalPrice}</b>
                    </p>
                    {totalOriPrice - totalPrice > 0 ? (
                      <p className="text-[10px] text-accent">
                        <b>Save RM {totalOriPrice - totalPrice}</b>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <button
                      className={`py-2 px-4 sm:py-4 sm:px-8 bg-accent rounded-lg text-xs
                      ${createQuoteLoad ? "bg-green-600" : "bg-accent"}`}
                      onClick={(event) => createNewQuoteJSON(event)}
                      disabled={
                        !rows.some((item) => item.totalPrice > 0 === true)
                      }
                    >
                      <p className="text-[10px] sm:text-sm">
                        <b>{createQuoteLoad ? "Generating.." : "Next"}</b>
                      </p>
                    </button>
                  </div>
                </div>

                <div className="sm:hidden flex w-full text-center">
                  {totalPrice > 0 ? (
                    <p className="text-[10px] w-full">
                      Starting from{" "}
                      <b className="text-accent">
                        {Math.floor(totalPrice / (1 - 0.04) / 12)}/mo
                      </b>{" "}
                      with listed Bank.
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ${
            hideNavbar2 ? "top-0" : "top-[72px] sm:top-[102px]"
          } */}
      </div>
      <div className="text-center mb-4 relative">
        <h2>Choose your parts</h2>
        <br />
        <input
          className="text-black max-w-[600px] w-full px-2 py-2 bg-secondary rounded-md text-xs"
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => handleSearchEnter(e)}
          onBlur={() => {
            setTimeout(() => {
              setSearchFocus(false);
            }, 100);
          }}
          onFocus={() => setSearchFocus(true)}
        />
        <div
          className="max-w-[600px] max-h-[200px] overflow-y-scroll w-full mx-auto bg-secondary text-black
        absolute top-[100%] left-[50%] translate-x-[-50%] translate-y-[0%] z-[1] searchQuery"
        >
          {searchFocus &&
            searchTerm &&
            filteredProducts.map((product, index) => (
              <React.Fragment key={index}>
                <div
                  className="
                  mobilehover:hover:bg-slate-400 mobilehover:hover:text-white 
                  cursor-pointer text-left px-2 py-[2px] border-[1px] border-zinc-400
                  "
                  onClick={() => handleSearchSelect(product.option.name)}
                >
                  <p style={{ fontSize: 12 }}>
                    {product.option.name} | <b>RM {product.option.price}</b>
                  </p>
                </div>
              </React.Fragment>
            ))}
        </div>
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
                  selectedProduct={selectedProduct}
                />
              );
            })}
          </tbody>
          {/* <tfoot className="sticky bottom-0 w-full bg-gradient-to-t from-primary hidden">
            <tr className="sticky bottom-4">
              <td className="hidden sm:table-cell"></td>
              <td className="hidden sm:table-cell"></td>
              <td className="h-full pr-2 hidden sm:table-cell align-top">
                <div className="flex flex-col w-full">
                  <div className="border-b-[10px] border-[transparent] w-full rounded-xl mt-4" />
                  <div className="flex flex-col items-end justify-between h-32 mt-4">
                    <button
                      className="
                    py-4 px-8 bg-secondary text-black rounded-2xl w-28
                    mobilehover:hover:bg-[#a7a7a7] transition-all"
                    >
                      <p>
                        <b>Reset</b>
                      </p>
                    </button>
                    <button
                      onClick={(event) => createNewQuoteJSON(event)}
                      className="
                      py-4 px-8 bg-accent text-secondary rounded-2xl w-28
                      mobilehover:hover:bg-[#0069cd] transition-all"
                    >
                      <p>
                        <b>Next</b>
                      </p>
                    </button>
                  </div>
                </div>
              </td>
              <td colSpan={2} className="pl-2 block sm:table-cell">
                <div
                  className="
                flex max-w-[300px] justify-between mx-auto
                sm:w-full"
                >
                  <div className="flex flex-col w-full sm:hidden">
                    <div className="border-b-[10px] border-[transparent] w-[50%] rounded-xl mt-4 sm:w-full sm:hidden" />
                    <div className="flex sm:hidden flex-col items-start justify-between h-32 mt-4">
                      <button
                        className="
                        py-4 px-8 bg-secondary text-black rounded-2xl w-28 shadow-2xl
                        mobilehover:hover:bg-[#a7a7a7] transition-all "
                        onClick={(event) => resetForm(event)}
                      >
                        <p>
                          <b>Reset</b>
                        </p>
                      </button>
                      <button
                        onClick={(event) => createNewQuoteJSON(event)}
                        className="
                        py-4 px-8 bg-accent text-secondary rounded-2xl w-28 shadow-2xl
                        mobilehover:hover:bg-[#0069cd] transition-all"
                      >
                        <p>
                          <b>Next</b>
                        </p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="border-b-[10px] border-[#009BFF] w-full rounded-xl mt-4" />
                    <div
                      className="
                    bg-secondary w-full text-black rounded-2xl h-32 mt-4 flex justify-center items-center flex-col gap-2
                    shadow-2xl text-center
                    sm:w-full"
                    >
                      <p>
                        <b>Grand Total</b>
                      </p>
                      <div className="border-b-[1px] border-black w-[70%]" />
                      <p>
                        <b>RM {totalPrice}</b>
                        <br />
                        <b>Original: RM {totalOriPrice}</b>
                      </p>
                      <p>
                        <b style={{ color: "gray", fontSize: 12 }}>
                          <s> RM {totalOriPrice}</s>
                        </b>
                        <br />
                        <b style={{ fontSize: 20 }}>RM {totalPrice}</b>
                        <br />
                        {totalPrice > 0 ? (
                          <b style={{ color: "#009BFF", fontSize: 12 }}>
                            Save RM {totalOriPrice - totalPrice}
                          </b>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                    {totalPrice > 0 ? (
                      <div className="text-center mt-2">
                        <p style={{ fontSize: 12 }}>
                          Starting from{" "}
                          <b style={{ color: "#009BFF" }}>
                            {Math.floor(totalPrice / (1 - 0.05) / 18)}/mo
                          </b>{" "}
                          with AEON Credit Card
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </tfoot> */}
        </table>
      </form>
    </div>
  );
}

export default Form;
