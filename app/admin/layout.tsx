import dynamic from "next/dynamic";
import SideNavbarContent from "../(main-components)/SideNavbarContent";

const AdminNavbar = dynamic(() => import("./(admin-components)/AdminNavbar"), {
  ssr: false,
});

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`relative`}>
      <AdminNavbar />
      <SideNavbarContent className="w-full px-16 pt-4">
        {children}
      </SideNavbarContent>
      {/* <div className="h-[50vh]" /> */}
    </div>
  );
}
