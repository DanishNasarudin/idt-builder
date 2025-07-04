"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useScrollListener } from "@/lib/hooks/useScrollListener";
import { menuList } from "@/lib/menu";
import { cn } from "@/lib/utils";
import {
  ProductSelectionData,
  useNavbarStore,
  useUserSelected,
} from "@/lib/zus-store";
import { ChevronDown, MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { queueWrite } from "../../services/textDbActions";
import { LogoIcon } from "./icons";

export default function Navbar() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const scroll = useScrollListener();

  const isBuildPage = useNavbarStore((state) => state.isBuildPage);
  const dataClient = useUserSelected((state) => state.dynamicData);
  const selected = useUserSelected((state) => state.selected);
  const resetDataClient = useUserSelected((state) => state.resetData);
  const dataToQuote = useUserSelected((state) => state.dataToQuote);
  const setIsBuildPage = useNavbarStore((state) => state.setIsBuildPage);

  const [hideNavbar, setHideNavbar] = useState(false);
  const [data, setData] = useState<ProductSelectionData>(selected);

  // Clear the link from google analytics
  let isSafari: boolean;
  let pathname = "";

  if (typeof window !== "undefined") {
    pathname = String(window.location.search);

    isSafari = /^((?!chrome|android).)*safari/i.test(
      window.navigator.userAgent
    );
  }

  const createQuote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const check = selected;
    if (check.grand_total === 0) return;
    const id = uuidv4();
    const quoteData = dataToQuote();

    await queueWrite(quoteData, id);

    let quoteWindow;
    if (isSafari) {
      quoteWindow = window.open("about:blank", "_blank");
    }

    const quoteUrl = `${window.location.protocol}//${window.location.host}/quote/${id}`;

    if (isSafari) {
      router.push(`/quote/${id}`);
      setIsBuildPage(false);
    } else {
      window.open(quoteUrl, "_blank");
    }
  };

  useEffect(() => {
    setTheme("dark");
  }, []);

  // For navbar hide on scroll
  useEffect(() => {
    if (scroll.checkY > 0) {
      setHideNavbar(true);
    } else if (scroll.checkY < 0) {
      setHideNavbar(false);
    }
  }, [scroll.y, scroll.lastY]);

  // For when user is trying to edit quotes
  useEffect(() => {
    if (isBuildPage) {
      setData(selected);
    }
  }, [dataClient, isBuildPage]);

  // Remove Google Analytics parameters
  useEffect(() => {
    if (pathname.includes("_ga") || pathname.includes("_gl")) {
      router.replace("/");
    }
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all
    ${
      hideNavbar
        ? isBuildPage
          ? "translate-y-[-50%] sm:translate-y-[-60%]"
          : "translate-y-[-100%]"
        : ""
    }
    `}
    >
      <div
        className={`
    top-0 z-[100] border-b-[1px] border-border bg-background/80 transition-all 
    before:absolute before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']
    
    `}
      >
        <div
          className="
        
      relative mx-auto max-w-[1060px]"
        >
          <NavigationMenu
            className="z-[100] mx-auto hidden w-full max-w-none items-center justify-between
            px-4 py-4 text-xs sm:flex sm:w-4/5 sm:px-0 sm:py-8 [&>div:first-child]:w-full
      [&>div]:flex"
            delayDuration={0}
          >
            <NavigationMenuList
              className="flex justify-between"
              style={{ width: "100%" }}
            >
              <a href="/">
                <LogoIcon size={32} />
              </a>
              {menuList.map((main, idx) => {
                if (main.dropdown === undefined) {
                  return (
                    <React.Fragment key={idx}>
                      <NavigationMenuItem className="bg-transparent">
                        <NavigationMenuLink
                          href={main.href}
                          target={main.target ? "_blank" : undefined}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "hover:accent/50 bg-transparent"
                          )}
                        >
                          {main.title}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={idx}>
                      <Popover>
                        <PopoverTrigger asChild className="gap-2">
                          <Button
                            variant="ghost"
                            className="[&[data-state=open]>svg]:rotate-0"
                          >
                            {main.title}
                            <ChevronDown className="h-4 w-4 shrink-0 rotate-90 duration-200 transition-transform" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className={cn(
                            "z-[100] mt-8",
                            "relative overflow-hidden bg-background/50"
                          )}
                        >
                          <ul className=" transition-all before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']">
                            {main.dropdown.map((drop) => (
                              <ListItem
                                key={drop.title}
                                title={drop.title}
                                href={drop.href}
                                target={drop.target ? "_blank" : undefined}
                                className="flex items-center"
                              ></ListItem>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </React.Fragment>
                  );
                }
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="z-[100] flex justify-between px-4 py-4 sm:hidden">
            <a href="/">
              <img
                src="https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png"
                alt="logo"
                className="z-10 w-10"
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-transparent px-2 text-white">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="
              top-0 z-[100] flex w-full
              flex-col border-b-[1px] border-[#323232] bg-background/80 transition-all 
    before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']
              "
              >
                <NavigationMenu className="mt-8 w-full max-w-none items-start [&>div:first-child]:w-full">
                  <NavigationMenuList className="flex w-full flex-col items-start gap-2 space-x-0">
                    {menuList.map((main, idx) => {
                      if (main.dropdown === undefined) {
                        return (
                          <React.Fragment key={idx}>
                            <NavigationMenuItem className="w-full bg-transparent">
                              <Link
                                href={main.href}
                                target={main.target ? "_blank" : undefined}
                              >
                                <NavigationMenuLink
                                  className={cn(
                                    navigationMenuTriggerStyle(),
                                    "hover:accent/50 w-full justify-start bg-transparent px-0"
                                  )}
                                >
                                  {main.title}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment key={idx}>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full text-sm"
                            >
                              <AccordionItem
                                value={String(idx)}
                                className="border-b-0 data-[state=open]:border-b"
                              >
                                <AccordionTrigger className="py-2">
                                  {main.title}
                                </AccordionTrigger>
                                <AccordionContent className="mt-2 flex flex-col gap-2">
                                  {main.dropdown.map((drop) => (
                                    <ListItem
                                      key={drop.title}
                                      title={drop.title}
                                      href={drop.href}
                                      target={
                                        drop.target ? "_blank" : undefined
                                      }
                                      className="flex items-center"
                                    ></ListItem>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </React.Fragment>
                        );
                      }
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
                <SheetFooter className="flex-col gap-4 text-zinc-400">
                  <LogoIcon size={40} className="text-white" />
                  <p>Ideal Tech PC Sdn Bhd</p>
                  <p>
                    17, Jalan Pandan Prima 1, Dataran Pandan Prima, 55100 Kuala
                    Lumpur. 201401008251 (1084329-M)
                  </p>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div
        className={`
      sticky top-0 z-[15] border-b-[1px] border-border bg-background/80 transition-all
      before:absolute before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']
      ${isBuildPage ? "block" : "hidden"}`}
      >
        <div className="mx-auto max-w-[1060px] py-2">
          <div className="mx-auto flex w-auto items-center justify-between px-4 sm:w-4/5 sm:px-0 ">
            <div className="flex w-full flex-col justify-center sm:flex-row">
              <div className="flex w-full  items-center justify-between">
                <div className="flex items-center gap-8 ">
                  <div>
                    <button
                      className="rounded-lg border-[1px] border-foreground px-4 py-2 text-xs sm:px-8 sm:py-4 text-[10px] sm:text-sm font-bold"
                      onClick={() => resetDataClient()}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="hidden text-center sm:block sm:text-left">
                    {data.ori_total - data.grand_total > 0 ? (
                      <p className="text-[10px] text-foreground/60 line-through font-bold">
                        RM {data.ori_total}
                      </p>
                    ) : (
                      ""
                    )}
                    <p>
                      <b>RM {data.grand_total}</b>
                    </p>
                    {data.ori_total - data.grand_total > 0 ? (
                      <p className="text-[10px] text-primary">
                        <b>Save RM {data.ori_total - data.grand_total}</b>
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="hidden sm:flex">
                    {data.grand_total > 0 ? (
                      <p className="text-[10px]">
                        Starting from <br />{" "}
                        <b className="text-primary">
                          {Math.floor(data.grand_total / (1 - 0.04) / 12)}/mo
                        </b>{" "}
                        <br /> with listed Bank.
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="block text-center sm:hidden sm:text-left">
                  {data.ori_total - data.grand_total > 0 ? (
                    <p className="text-[10px] text-gray-400">
                      <b>
                        <s>RM {data.ori_total}</s>
                      </b>
                    </p>
                  ) : (
                    ""
                  )}
                  <p>
                    <b>RM {data.grand_total}</b>
                  </p>
                  {data.ori_total - data.grand_total > 0 ? (
                    <p className="text-[10px] text-primary">
                      <b>Save RM {data.ori_total - data.grand_total}</b>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <button
                    disabled={
                      data.grand_total === 0 || data.grand_total === undefined
                    }
                    className={cn(
                      data.grand_total === 0 || data.grand_total === undefined
                        ? "bg-foreground/30 cursor-default"
                        : "bg-primary",
                      "rounded-lg px-4 py-2 text-xs  sm:px-8 sm:py-4"
                    )}
                    onClick={(e) => data.grand_total > 0 && createQuote(e)}
                  >
                    <p className="text-[10px] sm:text-sm">
                      <b>{false ? "Generating.." : "Next"}</b>
                    </p>
                  </button>
                </div>
              </div>
              <div className="flex w-full text-center sm:hidden">
                {data.grand_total > 0 ? (
                  <p className="w-full text-[10px]">
                    Starting from{" "}
                    <b className="text-primary">
                      {Math.floor(data.grand_total / (1 - 0.04) / 12)}/mo
                    </b>{" "}
                    with listed Bank.
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:text-accent-foreground focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
