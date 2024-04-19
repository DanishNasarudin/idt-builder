import { db } from "@/db/db";
import AdminHead from "./(admin-components)/AdminHead";

type Props = {};

async function AdminPage({}: Props) {
  const category = await db.query.product_category.findMany({});
  const newLinks = category.map((item) => {
    let input = item.name && item.name.replace(/\d{2}\.\s/g, "").trim();
    if (!input) return;
    input = input?.toLowerCase();
    const lines = input.split("\n");

    const transformed = lines.map((line) => {
      line = line.replace(/&/g, "n");
      line = line.replace(/[\(\),]/g, "");
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
  return (
    <div className="flex flex-col gap-4 py-16">
      {" "}
      <h2>Price List</h2>
      <AdminHead
        category={newLinks.sort((a, b) => Number(a?.id) - Number(b?.id))}
      />
    </div>
  );
}

export default AdminPage;
