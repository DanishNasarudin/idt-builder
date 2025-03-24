import Offers from "@/app/(components)/Offers";
import { readData } from "@/app/(serverActions)/textDbActions";
import {
  CategoryType,
  getAllPriceList,
} from "@/app/(serverActions)/textDbPriceListActions";
import { ProductItemSelectionData, QuoteData } from "@/lib/zus-store";
import GrandTotal from "../(quote-components)/GrandTotal";
import NewForm from "../(quote-components)/NewForm";
import TableDisplay from "../(quote-components)/TableDisplay";
import UserActions from "../(quote-components)/UserActions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const quoteId = params.id;
  const data = (await readData(quoteId)) as QuoteData;

  function extractBrandAndModel(product: string): string {
    const tokens: string[] = product.split(" ");
    if (tokens.length === 0) return "";

    const brand: string = tokens[0];
    // Find the first token that contains a digit (assuming it's the model)
    const model: string | undefined = tokens.find((token) => /\d/.test(token));

    return model ? `${brand} ${model}` : brand;
  }

  const regex =
    /^(?:\s*[\(\[][^\)\]]*[\)\]]\s*)+|(?:\s*[\(\[][^\)\]]*[\)\]]\s*)+$/g;

  const imageSample = data.formData
    .filter(
      (data) =>
        data.category.includes("Graphic Card") ||
        data.category.includes("Case") ||
        data.category.includes("Cooler") ||
        data.category.includes("RAM")
    )
    .map((data) =>
      data.selectedOption.name
        .replace(/^(?:\s*(\([^()]*\)|\[[^\]]*\]))+\s*/g, "")
        .replace(/\s*(\([^()]*\)|\[[^\]]*\])+\s*$/g, "")
        .trim()
    );

  const cleanedString: string = imageSample.map(extractBrandAndModel).join(" ");

  type SearchImageType = {
    images: string[];
    count: number;
  };

  const searchImage = await fetch(
    "https://photostock.idealtech.com.my/getImage",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ search: cleanedString }),
    }
  );

  const imagesData: SearchImageType = await searchImage.json();

  const imagesLink = imagesData.images.map(
    (image) => `https://photostock.idealtech.com.my${image}`
  );

  if (imagesLink.length > 0) {
    return {
      title: "Quote",
      openGraph: {
        title: "Quote | Ideal Tech PC Builder",
        images: [
          {
            url: imagesLink[0],
            width: 1000,
            height: 1000,
            alt: "Ideal Tech Custom PC",
          },
        ],
      },
    };
  } else {
    return {
      title: "Quote",
      openGraph: {
        title: "Quote | Ideal Tech PC Builder",
      },
    };
  }
}

export type DisplayFormData = {
  name: string;
  price: number;
  qty: number;
  total: number;
};

const QuotePage = async ({ params }: { params: { id: string } }) => {
  const quoteId = params.id;

  const data = (await readData(quoteId)) as QuoteData;

  // const data2 = (await readData(quoteId)) as ProductSelectionData;

  const createDate = new Date(data.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const displayData: DisplayFormData[] = data.formData.map((data) => {
    return {
      name: data.selectedOption.name,
      price: data.selectedOption.price,
      qty: data.quantity,
      total: data.total,
    };
  });

  // console.log(imageSample.join(" "));

  const dataPriceList: CategoryType[] = await getAllPriceList();

  const dataFormList: ProductItemSelectionData[] = dataPriceList.map((item) => {
    return {
      ...item,
      qty: 0,
      sub_total: 0,
      selected_id: undefined,
      duplicate: false,
      discount: 0,
    };
  });

  function extractBrandAndModel(product: string): string {
    const tokens: string[] = product.split(/\s+/);
    if (tokens.length === 0) return "";

    const brand: string = tokens[0];
    // Find the first token that contains a digit.
    let modelToken: string | undefined = tokens.find((token) =>
      /\d/.test(token)
    );
    // If none found, use the second token.
    if (!modelToken && tokens.length > 1) {
      modelToken = tokens[1];
    }
    return modelToken ? `${brand} ${modelToken}` : brand;
  }

  const regex =
    /^(?:\s*[\(\[][^\)\]]*[\)\]]\s*)+|(?:\s*[\(\[][^\)\]]*[\)\]]\s*)+$/g;

  const imageSample = data.formData
    .filter(
      (data) =>
        data.category.includes("Graphic Card") ||
        data.category.includes("Case") ||
        data.category.includes("Cooler") ||
        data.category.includes("RAM")
    )
    .map((data) =>
      data.selectedOption.name
        .replace(/^(?:\s*(\([^()]*\)|\[[^\]]*\]))+\s*/g, "")
        .replace(/\s*(\([^()]*\)|\[[^\]]*\])+\s*$/g, "")
        .trim()
    );

  const cleanedString: string = imageSample.map(extractBrandAndModel).join(" ");

  type SearchImageType = {
    images: string[];
    count: number;
  };

  const searchImage = await fetch(
    "https://photostock.idealtech.com.my/getImage",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ search: cleanedString }),
    }
  );

  const imagesData: SearchImageType = await searchImage.json();

  const imagesLink = imagesData.images.map(
    (image) => `https://photostock.idealtech.com.my${image}`
  );

  // console.log(cleanedString, imagesLink);

  return (
    <>
      <div className="mx-auto max-w-[1060px]">
        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 py-8 sm:w-4/5 sm:px-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2>Quotation from Ideal Tech PC</h2>
            <p>Thank you for using Ideal Tech PC Builder.</p>
            <p>Quotation generated on: {createDate}</p>
          </div>
          <div>
            <Offers />
          </div>
          {/* {imagesLink.length > 0 && <PreviewCarousel images={imagesLink} />} */}
          <TableDisplay data={displayData} />
          <GrandTotal
            original={data.oriTotal}
            final={data.grandTotal}
            discount={data.oriTotal - data.grandTotal}
          />
          <UserActions quoteId={quoteId} data={data} dataList={dataFormList} />
          <NewForm quoteId={quoteId} />
        </div>
      </div>
      <div className="h-[200px]"></div>
    </>
  );
};

export default QuotePage;
