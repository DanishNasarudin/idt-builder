import React from "react";
import { SignOutButton, ClerkLoading } from "@clerk/nextjs";

type Props = {};

const Unauthorized = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 items-center h-[100vh] justify-center">
      <h2>You&apos;re not authorized.</h2>
      <SignOutButton>
        <button className="py-2 px-4 sm:py-4 sm:px-8 border-white border-[1px] rounded-lg w-fit mx-auto mobilehover:hover:bg-white/20 transition-all">
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
};

export default Unauthorized;
