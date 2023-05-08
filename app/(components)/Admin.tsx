"use client";

import { db, storage } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut, useSession } from "next-auth/react";
import { parse } from "papaparse";
import { useEffect, useState } from "react";

type Props = {};

function Admin({}: Props) {
  const { data: session } = useSession();
  const [allow, setAllow] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const securePage = async () => {
      if (session) {
        if (session?.user?.email === "danishaiman2000@gmail.com") {
          setAllow(1);
          setLoading(false);
        } else {
          setAllow(0);
          setLoading(false);
          signOut();
        }
      }
    };
    securePage();
  }, [session]);

  if (loading) {
    return (
      <h2 className="flex flex-col justify-center items-center h-[100vh] text-center">
        Loading...
      </h2>
    );
  }

  // Function to download data as CSV
  const downloadCSV = () => {
    const header = ["Category", "Brand", "Option Name", "Option Price"];

    const csvContent = "data:text/csv;charset=utf-8," + header.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const parseCSVData = (csvData: string) => {
    const parsedData = parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    const categoryMap = new Map<string, any>();

    console.log(parsedData);

    parsedData.data.forEach((row: any) => {
      const category = row.Category;
      const brand = row.Brand;
      const optionName = row.OptionName;
      const optionPrice = parseFloat(row.OptionPrice);

      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          brands: [],
        });
      }

      const categoryData = categoryMap.get(category);
      const existingBrand = categoryData.brands.find(
        (b: any) => b.name === brand
      );

      if (existingBrand) {
        existingBrand.options.push({ name: optionName, price: optionPrice });
      } else {
        categoryData.brands.push({
          name: brand,
          options: [{ name: optionName, price: optionPrice }],
        });
      }
    });

    const initialProducts = Array.from(categoryMap.values()).map((product) => {
      return {
        ...product,
        brands: product.brands.map((brand: any) => {
          return {
            ...brand,
            options: brand.options.filter(
              (option: any) => option !== undefined
            ),
          };
        }),
      };
    });

    console.log(initialProducts);
    return initialProducts;
  };

  // Function to handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target) {
        const csvData = event.target.result;

        // Save CSV file to Firebase Storage
        const storageRef = ref(storage, `csv/${file.name}`);
        await uploadBytes(
          storageRef,
          new Blob([csvData as string], { type: file.type })
        );

        // Get the download URL for the saved CSV file
        const downloadURL = await getDownloadURL(storageRef);

        // Process and save the formatted data to Firestore
        const formattedData = parseCSVData(csvData as string);

        await addDoc(collection(db, "products__data"), {
          csvUrl: downloadURL,
          data: formattedData,
        });

        console.log("CSV data saved");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] text-center">
      {allow === 1 ? (
        <div>
          <h1>Admin</h1>
          <button onClick={() => signOut()}>Logout</button>
          <br />
          <button onClick={downloadCSV}>Download CSV</button>
          <br />
          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <div>
          <h1>Not Admin</h1>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
