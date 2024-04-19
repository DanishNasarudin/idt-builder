"use client";
import { drizzleInsert } from "@/app/(serverActions)/drizzleCmd";
import { Button, Input, Textarea } from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";

type Props = {};

const AdminDataInput = (props: Props) => {
  const [value, setValue] = React.useState("");
  const [category, setCategory] = React.useState("0");

  const insertDB = async () => {
    try {
      if (value) {
        await drizzleInsert(value, category);
        toast.success("Data Uploaded.");
      }
    } catch (error) {
      throw new Error(`Database error (insertDB): ${error}`);
    }
  };

  // console.log(value);

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={value} onValueChange={(e) => setValue(e)} />
      <Input value={category} onValueChange={(e) => setCategory(e)} />
      <Button onClick={() => insertDB()}>Update</Button>
    </div>
  );
};

export default AdminDataInput;
