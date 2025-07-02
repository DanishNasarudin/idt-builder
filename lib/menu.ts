export type MenuStd = {
  title: string;
  href: string;
  target: boolean;
};

export type MenuList = MenuStd & {
  dropdown?: MenuStd[];
};

export const menuList: MenuList[] = [
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
