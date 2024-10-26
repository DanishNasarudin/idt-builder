import { LogoIcon } from "@/app/(components)/Icons";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex h-[100vh] flex-col items-center justify-center gap-2 text-center">
      <LogoIcon className="animate-[spin_2s_linear_infinite]" size={100} />
      <h2>Loading...</h2>
    </div>
  );
};

export default Loading;
