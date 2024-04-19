import BackendNavbar from "@/app/(main-components)/BackendNavbar";
import { OrdersIcon, SettingIcon } from "@/app/(main-components)/Icons";

const links = [
  {
    link: "/admin/settings",
    name: "Settings",
    icon: <SettingIcon size={18} />,
  },
];

const linksBranch = [
  {
    link: "/admin",
    name: "Price List",
    icon: <OrdersIcon size={18} />,
  },
];

const AdminNavbar = () => {
  return (
    <BackendNavbar title="Admin" topLink={links} bottomLink={linksBranch} />
  );
};

export default AdminNavbar;
