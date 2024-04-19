"use client";

import {
  deleteClerkUser,
  updateClerkUser,
} from "@/app/(serverActions)/clerkActions";
import { useEffect, useRef, useState } from "react";
import { Options, UserType } from "../page";
import DropdownStd from "./DropdownStd";
import TextBoxEditorStd from "./TextBoxEditorStd";

type Props = {
  dataValues: UserType;
  dataOptions: Options[];
  setRender: (val: React.SetStateAction<boolean>) => void;
};

const TableRowUser = ({ dataValues, dataOptions, setRender }: Props) => {
  const inputId = useRef(dataValues.id || "");
  const inputRole = useRef(dataValues.roles || "");
  const inputEmail = useRef(dataValues.email || "");
  const prevValue = useRef(
    { email: dataValues.email, role: dataValues.roles } || ""
  );
  // const [render, setRender] =useState(false)

  // OpenClose for Row ----
  const [openClose, setOpenClose] = useState({
    users: false,
    email: false,
  });

  const handleOpenClose = (id: string, open: boolean) => {
    // console.log(id, open, "check");
    setOpenClose({ ...openClose, [id]: open });
    if (open) return;
    updateUserDB();
  };

  // Handle outside click for all OpenClose Elements ----
  const openRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (openRef.current && openRef.current.contains(e.target as Node)) {
        setOpenClose({ ...openClose });
        updateUserDB();
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openRef]);

  const updateUserDB = async () => {
    // console.log(inputEmail.current, inputRole.current, "pass");
    // updateDB(
    //   "auth_users",
    //   "id",
    //   String(inputId.current),
    //   "roles",
    //   inputRole.current
    // );
    // updateDB(
    //   "auth_users",
    //   "id",
    //   String(inputId.current),
    //   "email",
    //   inputEmail.current
    // );
    await updateClerkUser(prevValue.current.email, inputRole.current);
    setRender((prev) => !prev);
  };

  return (
    <>
      <div
        className="
                          tab-row flex [&>div]:w-full [&>div]:px-2 [&>div]:h-full
                          border-t-[1px] border-zinc-800 [&>div]:border-l-[1px] [&>div]:border-zinc-800
                "
      >
        <TextBoxEditorStd
          boxSize={9999}
          buttonId="email"
          values={inputEmail.current}
          setInput={inputEmail}
          setOpenClose={handleOpenClose}
          openClose={openClose.email}
          updateDB={updateUserDB}
        />
        {dataOptions && (
          <DropdownStd
            boxSize={150}
            buttonId="users"
            options={dataOptions}
            values={inputRole.current}
            setOpenClose={handleOpenClose}
            openClose={openClose.users}
            setInput={inputRole}
            updateDB={updateUserDB}
          />
        )}
        <div className="max-w-[150px]">
          <button
            className={`
            text-red-500/80 underline
            mobilehover:hover:text-red-200
                           transition-all`}
            onClick={async () => {
              // deleteDB("auth_users", "id", String(keyId));
              await deleteClerkUser(prevValue.current.email);
              setRender((prev) => !prev);
            }}
          >
            <p>Delete</p>
          </button>
        </div>
        <div
          data-open={Object.values(openClose).some((value) => value === true)}
          ref={openRef}
          className="data-[open=true]:block data-[open=false]:hidden fixed z-[1] bg-transparent w-[100vw] h-[100vh] top-0 left-0"
        />
      </div>
    </>
  );
};

export default TableRowUser;
