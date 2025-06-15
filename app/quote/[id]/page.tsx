import Offers from "@/app/(components)/Offers";
import { readData } from "@/app/(serverActions)/textDbActions";
import {
  CategoryType,
  getAllPriceList,
} from "@/app/(serverActions)/textDbPriceListActions";
import { ProductItemSelectionData, QuoteData } from "@/lib/zus-store";
import CarouselDisplay from "../(quote-components)/CarouselDisplay";
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
    .filter((data) => data.category.includes("Case"))
    .map((data) =>
      data.selectedOption.name
        .replace(/^(?:\s*(\([^()]*\)|\[[^\]]*\]))+\s*/g, "")
        .replace(/\s*(\([^()]*\)|\[[^\]]*\])+\s*$/g, "")
        .trim()
    );

  const cleanedString: string = imageSample.join(" ");

  let images: ImageType[] = [];

  try {
    const searchImage = await fetch(
      "https://photostock.idealtech.com.my/api/results",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({ query: cleanedString }),
      }
    );
    images = ((await searchImage.json()) as SearchImageType).images.map(
      (item) => ({
        path: `https://photostock.idealtech.com.my${item.path}`,
        id: `https://photostock.idealtech.com.my/?search=id:${item.id}`,
      })
    );
  } catch (error) {
    images = [];
  }

  if (images.length > 0) {
    return {
      title: "Quote",
      openGraph: {
        title: "Quote | Ideal Tech PC Builder",
        images: [
          {
            url: images[0].path,
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

export type ImageType = {
  path: string;
  id: string;
};

export type SearchImageType = {
  images: ImageType[];
};

const QuotePage = async ({ params }: { params: { id: string } }) => {
  const quoteId = params.id;

  const data = (await readData(quoteId)) as QuoteData;

  // const data2 = (await readData(quoteId)) as ProductSelectionData;

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
    .filter((data) => data.category.includes("Case"))
    .map((data) =>
      data.selectedOption.name
        .replace(/ *(\([^)]*\)|\[[^\]]*\]) */g, " ")
        .replace(/\s+/g, " ")
        .trim()
    );

  const cleanedString: string = imageSample.join(" ");

  let images: ImageType[] = [];

  try {
    const searchImage = await fetch(
      "https://photostock.idealtech.com.my/api/results",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({ query: cleanedString }),
      }
    );
    images = ((await searchImage.json()) as SearchImageType).images.map(
      (item) => ({
        path: `https://photostock.idealtech.com.my${item.path}`,
        id: `https://photostock.idealtech.com.my/?search=id:${item.id}`,
      })
    );
  } catch (error) {
    images = [];
  }

  console.log(cleanedString, images);

  return (
    <>
      <div className="mx-auto max-w-[1060px] relative overflow-hidden">
        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 py-8 sm:w-4/5 sm:px-0">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2>Quotation from Ideal Tech PC</h2>
            <p>Thank you for using Ideal Tech PC Builder.</p>
            <p>Quotation generated on: {data.createdAt}</p>
            <p className="text-foreground/60">
              IDEAL TECH PC SDN BHD 201401008251 (1084329-M)
            </p>
          </div>
          <div>
            <Offers />
          </div>
          {images.length > 0 && (
            <div className="border-border border-[1px] p-4 rounded-xl text-center space-y-2 sm:pb-4 pb-9">
              <p className="text-foreground/60">Example Builds</p>
              <CarouselDisplay images={images} />
            </div>
          )}
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
