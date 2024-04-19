"use client";

import { useEffect, useState } from "react";
import UserSettings from "./(settings-components)/UserSettings";

type Props = {};

export type UserType = {
  id: string;
  email: string;
  roles: string;
};

type SettingsType = {
  users: UserType;
};

export type Options = {
  option: string;
  color: string;
};

type DropdownOptions = {
  users: Options[];
};

export type OpenClose = {
  users: boolean;
  email: boolean;
};

const dropdownOptions: DropdownOptions = {
  users: [
    { option: "Admin", color: "bg-purple-600 text-purple-100" },
    { option: "Staff", color: "bg-emerald-600 text-emerald-100" },
    { option: "Normal", color: "bg-gray-600 text-gray-100" },
  ],
};

const Settings = (props: Props) => {
  const [render, setRender] = useState(false);
  const [data, setData] = useState<UserType[]>([]);

  useEffect(() => {
    // fetchUsers().then((users: UserType[]) => setData(users));
    // fetchClerkUser();
  }, [render]);

  return (
    <>
      <div className="hidden w-full flex-col gap-16 px-16 py-4 md:flex">
        <div className="top nav flex w-full justify-end">
          {/* <Avatar className="rounded-full w-8">
            <AvatarImage src="https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png" />
            <AvatarFallback>IT</AvatarFallback>
          </Avatar> */}
        </div>

        <UserSettings dataOptions={dropdownOptions.users} />
        <div className="h-[20vh]" />
      </div>
      <div className="flex h-[100vh] w-full items-center justify-center text-center md:hidden">
        <h2>Use Desktop PC</h2>
      </div>
    </>
  );
};

export default Settings;
