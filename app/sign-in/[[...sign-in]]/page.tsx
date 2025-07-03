import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center h-[100vh] items-center">
      <SignIn />
    </div>
  );
}
