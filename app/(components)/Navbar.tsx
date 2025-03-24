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
import { cn } from "@/lib/utils";
import {
  ProductSelectionData,
  useNavbarStore,
  useUserSelected,
} from "@/lib/zus-store";
import { ChevronDown, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useScrollListener } from "../(hooks)/useScrollListener";
// import { drizzleInsertQuote } from "../(serverActions)/drizzleCmd";
import { queueWrite } from "../(serverActions)/textDbActions";
import { LogoIcon } from "./Icons";

type Props = {};

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

type MenuStd = {
  title: string;
  href: string;
  target: boolean;
};

type MenuList = MenuStd & {
  dropdown?: MenuStd[];
};

const menuList: MenuList[] = [
  {
    title: "Home",
    href: "https://idealtech.com.my/",
    target: true,
    dropdown: undefined,
  },
  {
    title: "About",
    href: "javascript:void(0)",
    target: true,
    dropdown: [
      {
        title: "Ideal Tech PC",
        href: "https://idealtech.com.my/about-us/",
        target: true,
      },
      {
        title: "Events",
        href: "https://idealtech.com.my/offline-events/",
        target: true,
      },
      {
        title: "NVIDIA AI PC",
        href: "https://idealtech.com.my/nvidia-rtx-ai/",
        target: true,
      },
      {
        title: "NVIDIA Studio PC",
        href: "https://idealtech.com.my/geforce-studiopc/",
        target: true,
      },
    ],
  },
  {
    title: "Special Offer ",
    href: "javascript:void(0)",
    target: true,
    dropdown: [
      {
        title: "Package Gaming PCs",
        href: "https://idealtech.com.my/gaming-pcs/#rtx-geforce-pc",
        target: true,
      },
      {
        title: "Workstation PC",
        href: "https://idealtech.com.my/workstation-pc",
        target: true,
      },
      {
        title: "Custom Watercooling PC",
        href: "https://watercool.idealtech.com.my/",
        target: true,
      },
    ],
  },
  {
    title: "Customer Care",
    href: "javascript:void(0)",
    target: true,
    dropdown: [
      {
        title: "AEON Easy Payment",
        href: "https://idealtech.com.my/aeon-easy-payment/",
        target: true,
      },
      {
        title: "Terms & Condition",
        href: "https://idealtech.com.my/terms-of-use/",
        target: true,
      },
      {
        title: "Warranty Service",
        href: "https://idealtech.com.my/warranty-info/",
        target: true,
      },
      {
        title: "Cancellation & Refund Policy",
        href: "https://idealtech.com.my/cancellation-and-returns-policy/",
        target: true,
      },
    ],
  },
  {
    title: "Contact Us",
    href: "https://idealtech.com.my/contact-us/",
    target: true,
    dropdown: [
      {
        title: "Contacts",
        href: "https://idealtech.com.my/contact-us/",
        target: true,
      },
      {
        title: "Career",
        href: "https://career.idealtech.com.my/",
        target: true,
      },
    ],
  },
];

function Navbar({}: Props) {
  // const [toggle, setToggle] = useState(true);
  // const [offerToggle, setOfferToggle] = useState(false);
  // const [careToggle, setCareToggle] = useState(false);
  const scroll = useScrollListener();
  const [hideNavbar, setHideNavbar] = useState(false);
  // console.log(scroll);

  useEffect(() => {
    if (scroll.checkY > 0) {
      setHideNavbar(true);
    } else if (scroll.checkY < 0) {
      setHideNavbar(false);
    }
  }, [scroll.y, scroll.lastY]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const isBuildPage = useNavbarStore((state) => state.isBuildPage);
  const dataClient = useUserSelected((state) => state.dynamicData);
  const selected = useUserSelected((state) => state.selected);
  const resetDataClient = useUserSelected((state) => state.resetData);
  const dataToQuote = useUserSelected((state) => state.dataToQuote);
  const setIsBuildPage = useNavbarStore((state) => state.setIsBuildPage);

  const [data, setData] = useState<ProductSelectionData>(selected);

  // const [dataSearchImage, setDataSearchImage] = useState<string[]>([]);

  // console.log(dataSearchImage, "CEHCL ");

  // const [buildPage, setBuildPage] = useState(false);

  useEffect(() => {
    if (isBuildPage) {
      setData(selected);

      const dataToString =
        selected.grand_total > 0
          ? selected.product_items
              .map((item) => {
                const productName = item.products[0].product_name;
                const match = productName.match(/^[^\(\[]+/);
                return match ? match[0].trim() : productName;
              })
              .join(", ")
          : "";

      // getImageFromStock(dataToString).then((images) => {
      //   setDataSearchImage(images.images);
      // });

      // console.log(dataToString, "PASS");

      // setBuildPage(true);
    }
  }, [dataClient, isBuildPage]);

  const router = useRouter();

  // ------ clear the link from google analytics
  let isSafari: boolean;
  let pathname = "";

  if (typeof window !== "undefined") {
    pathname = String(window.location.search);

    isSafari = /^((?!chrome|android).)*safari/i.test(
      window.navigator.userAgent
    );
  }
  useEffect(() => {
    // // List of common Google Analytics parameters - remove them

    if (pathname.includes("_ga") || pathname.includes("_gl")) {
      router.replace("/");
    }
  }, [pathname]);

  const createQuote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const check = selected;
    if (check.grand_total === 0) return;
    const id = uuidv4();
    const quoteData = dataToQuote();
    // console.log(id, quoteData);

    await queueWrite(quoteData, id);
    // await drizzleInsertQuote(id, json);

    let quoteWindow;
    if (isSafari) {
      quoteWindow = window.open("about:blank", "_blank");
    }

    const quoteUrl = `${window.location.protocol}//${window.location.host}/quote/${id}`;

    if (isSafari) {
      // serverConsole("pass");
      // quoteWindow.location.href = quoteUrl;
      router.push(`/quote/${id}`);
      setIsBuildPage(false);
    } else {
      window.open(quoteUrl, "_blank");
    }
  };

  const preventHover = (event: any) => {
    const e = event as Event;
    e.preventDefault();
  };

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
    top-0 z-[100] border-b-[1px] border-[#323232] bg-background/80 transition-all 
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
                <img
                  src="https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png"
                  alt="logo"
                  className="z-10 w-10"
                />
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
      sticky top-0 z-[15] border-b-[1px] border-[#323232] bg-background/80 transition-all
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
                      className="rounded-lg border-[1px] border-white px-4 py-2 text-xs sm:px-8 sm:py-4"
                      onClick={() => resetDataClient()}
                    >
                      <p className="text-[10px] sm:text-sm">
                        <b>Reset</b>
                      </p>
                    </button>
                  </div>
                  <div className="hidden text-center sm:block sm:text-left">
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
                      <p className="text-[10px] text-accent">
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
                        <b className="text-accent">
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
                    <p className="text-[10px] text-accent">
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
                        ? "bg-zinc-500 cursor-default"
                        : "bg-accent",
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
                    <b className="text-accent">
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
export default Navbar;

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
