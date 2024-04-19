"use client";

import { Button, Textarea } from "@nextui-org/react";
import fs from "fs/promises";
import path from "path";
import React from "react";

type Props = {};

const CustomAdmin = (props: Props) => {
  const [value, setValue] = React.useState("");

  const insertDB = async () => {
    try {
      const dirPath = path.join(process.cwd(), "data");
      const files = await fs.readdir(dirPath);
      for (let file of files) {
        const filePath = path.join(dirPath, file);
      }
    } catch (error) {
      throw new Error(`Database error (insertDB): ${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={value} onValueChange={(e) => setValue(e)} />
      <Button onClick={() => insertDB()}>Update</Button>
    </div>
  );
};

export default CustomAdmin;
