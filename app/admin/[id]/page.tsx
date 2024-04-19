import { db } from "@/db/db";
import { unstable_noStore as noStore } from "next/cache";
import AdminBodyShcn from "../(admin-components)/AdminBodyShcn";
import AdminHead from "../(admin-components)/AdminHead";

type Props = {
  params: { id: string };
};

const Admin = async ({ params }: Props) => {
  noStore();
  const category = await db.query.product_category.findMany({});
  //   console.log(category);
  const newLinks = category.map((item) => {
    let input = item.name && item.name.replace(/\d{2}\.\s/g, "").trim();
    if (!input) return;
    input = input?.toLowerCase();
    const lines = input.split("\n");

    const transformed = lines.map((line) => {
      // Replace specific words or characters
      line = line.replace(/&/g, "n"); // Replace '&' with 'n'
      line = line.replace(/[\(\),]/g, ""); // Remove parentheses, commas

      // Optional: Remove content within parentheses - Uncomment if needed
      // line = line.replace(/\(.*?\)/g, '');

      //    Trim and replace spaces with dashes
      line = line.trim().replace(/\s+/g, "-");

      return line;
    });

    transformed.join("\n");

    return {
      name: item.name ? item.name : "",
      link: `/admin/${String(transformed)}`,
      id: item.sort_val,
      db_id: item.id,
    };
  });

  const content = await db.query.product_category.findMany({
    where: (product_category, { eq }) =>
      eq(
        product_category.id,
        newLinks.find(
          (item) => String(item?.link).split("/").pop() === params.id,
        )?.db_id as number,
      ),
    columns: {
      id: true,
    },
    with: {
      product: {
        columns: {
          category_id: false,
          createdAt: false,
          updatedAt: false,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 py-16">
      {" "}
      <h2>Price List</h2>
      <div className="flex flex-col gap-2">
        <AdminHead
          category={newLinks.sort((a, b) => Number(a?.id) - Number(b?.id))}
        />
        {/* <AdminBody content={content[0]} />
        <AdminBodyText content={content[0]} /> */}
        <AdminBodyShcn content={content[0]} />
      </div>
    </div>
  );
};

export default Admin;
