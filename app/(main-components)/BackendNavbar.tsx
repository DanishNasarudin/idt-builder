"use client";
import { useNavbarStore } from "@/lib/zus-store";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button, Tooltip, Link as UILink } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  LogoIcon,
  ArrowCircleIcon,
  ArrowDoubleIcon,
  LightIcon,
  DarkIcon,
} from "./Icons";

type LinkType = {
  link: string;
  name: string;
  icon: JSX.Element;
};

type LinkArray = {
  title: string;
  topLink: LinkType[];
  bottomLink: LinkType[];
};

const BackendNavbar = ({ title, topLink, bottomLink }: LinkArray) => {
  // const [closeSidebar, setCloseSidebar] = useState(false);
  const { isOpen: closeSidebar, setIsOpen: setCloseSidebar } = useNavbarStore();
  const user = useUser();
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <nav
      aria-checked={closeSidebar}
      className={`z-[5]
      group fixed peer/nav
    ${
      !closeSidebar ? "max-w-[200px]" : "max-w-min"
    } w-full h-screen border-r-[1px]
    border-grayLine dark:bg-grayDarkBg
    flex flex-col justify-between p-4
    transition-all`}
    >
      <div
        className={`flex flex-col gap-2 ${!closeSidebar ? "" : "items-center"}`}
      >
        <Link href={"/"} className={`${!closeSidebar ? "" : "w-min mx-auto"}`}>
          <button className="flex items-center gap-4 group/back max-w-min">
            <div className="relative">
              <LogoIcon
                size={32}
                className="dark:fill-white fill-zinc-900 w-8 mobilehover:group-hover/back:opacity-0 transition-all"
              />
              <ArrowCircleIcon
                size={32}
                className={`dark:fill-white fill-zinc-900 w-8 absolute top-0 -rotate-90 opacity-0 mobilehover:group-hover/back:opacity-100 transition-all`}
              />
            </div>
            {!closeSidebar ? <h5 className={`font-bold`}>{title}</h5> : ""}
          </button>
        </Link>
        <div className="border-[1px] border-transparent my-1" />
        {topLink.map((val, key) => {
          return (
            <Tooltip
              key={key}
              isDisabled={!closeSidebar}
              closeDelay={0}
              content={val.name}
              placement="right"
              size="sm"
              radius="sm"
            >
              <Button
                as={UILink}
                href={val.link}
                startContent={val.icon}
                radius="sm"
                size="md"
                fullWidth={!closeSidebar}
                isIconOnly={closeSidebar}
                className={`
                      fill-grayDark text-grayDark bg-transparent mobilehover:hover:bg-grayDarkHover mobilehover:hover:text-accent gap-4
        
                      ${!closeSidebar ? "justify-start" : ""}`}
              >
                {!closeSidebar ? val.name : ""}
              </Button>
            </Tooltip>
          );
        })}
        <div className="border-[1px] dark:border-zinc-800 border-zinc-400 my-4 w-full" />
        {bottomLink.map((val, key) => {
          return (
            <Tooltip
              key={key}
              isDisabled={!closeSidebar}
              closeDelay={0}
              content={val.name}
              placement="right"
              size="sm"
              radius="sm"
            >
              <Button
                as={Link}
                href={val.link}
                startContent={val.icon}
                radius="sm"
                size="md"
                fullWidth={!closeSidebar}
                isIconOnly={closeSidebar}
                className={`
                      fill-grayDark text-grayDark bg-transparent mobilehover:hover:bg-grayDarkHover mobilehover:hover:text-accent gap-4
        
                      ${!closeSidebar ? "justify-start" : ""}`}
              >
                {!closeSidebar ? val.name : ""}
              </Button>
            </Tooltip>
          );
        })}
        <Button
          isIconOnly
          className="
          group/sideButton
          opacity-0 mobilehover:group-hover:opacity-100
          absolute top-0 right-0 translate-x-[100%]
          rounded-r-md border-[1px] border-grayLine
          dark:bg-grayDarkBg dark:mobilehover:hover:bg-grayDarkHover"
          radius="none"
          size="sm"
          startContent={
            <ArrowDoubleIcon
              className={`${
                closeSidebar ? "rotate-90" : "-rotate-90"
              } fill-grayDark`}
              size={18}
            />
          }
          onClick={() => {
            setCloseSidebar(!closeSidebar);
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button
            className="dark:bg-zinc-900 bg-zinc-300 dark:mobilehover:hover:bg-zinc-800 mobilehover:hover:bg-zinc-400 w-min p-4 rounded-md transition-all"
            onClick={toggleTheme}
          >
            <LightIcon className="dark:hidden" />
            <DarkIcon className="hidden dark:block" />
          </button>
          <p className="dark:hidden">Light theme not done</p>
        </div>
        <div className="flex items-center gap-4 py-2 px-2 rounded-md border-[1px] dark:border-zinc-800 border-zinc-400">
          <UserButton />
          {!closeSidebar ? (
            <p className="whitespace-nowrap overflow-ellipsis overflow-hidden">
              {user.user?.fullName}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};

export default BackendNavbar;
