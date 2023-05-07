"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

type Props = {};

function Login({}: Props) {
  return (
    <div className="w-full flex flex-col gap-8 justify-center items-center h-[100vh]">
      <Image
        src="https://idealtech.com.my/wp-content/uploads/2023/03/IDT_LOGO-150x150.png"
        width={100}
        height={100}
        alt="logo"
      />
      <button onClick={() => signIn("google")} className="">
        Sign In to edit the database
      </button>
    </div>
  );
}

export default Login;
