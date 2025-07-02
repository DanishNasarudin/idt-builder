"use server";

export type SearchImageType = {
  images: string[];
  count: number;
};

export const getImageFromStock = async (
  value: string
): Promise<SearchImageType> => {
  const searchImage = await fetch(
    "https://photostock.idealtech.com.my/getImage",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ search: "PCCOOLER EX400 ARGB PLUS" }),
    }
  );

  if (searchImage.ok) {
    const imagesData: SearchImageType = await searchImage.json();

    return imagesData;
  } else {
    throw new Error("Fail fetch Images");
  }
};
