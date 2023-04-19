import Image from "next/image";

type Props = {
  src: string;
  text: string;
};

function Offer({ src, text }: Props) {
  const iconSize = 60;

  return (
    <div className="flex justify-start items-center text-left max-w-[240px] bg-zinc-900 p-4 rounded-2xl">
      <Image
        src={src}
        alt={"offer"}
        width={iconSize}
        height={iconSize}
        priority
      />
      <h6 className="ml-4">{text}</h6>
    </div>
  );
}

export default Offer;
