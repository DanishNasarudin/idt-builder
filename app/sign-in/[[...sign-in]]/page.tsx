import { auth, SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Signin = () => {
  const user = auth();
  if (user.userId) {
    redirect("/");
  }
  return (
    <div className="flex justify-center h-[100vh] items-center">
      <SignIn />
    </div>
  );
};

export default Signin;
