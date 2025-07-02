import Link from "next/link";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div
      className="
    flex flex-col items-center justify-between text-center py-4 pt-8 mt-16
    xs:flex-row xs:text-left sm:py-8"
    >
      <div className="w-4/5">
        <h1 className="my-2 xs:my-4">
          Ideal Tech Official <br />
          PC Builder
        </h1>
        <p className="hidden sm:block">
          You have taken a step forward into the Enthusiasts Realm. <br />
          <b className="font-normal text-primary">Calm yourself</b>, our builder
          will guide you through.
        </p>
        <p className="sm:hidden">
          You have taken a step forward into the Enthusiasts Realm.{" "}
          <b className="font-normal text-primary">Calm yourself</b>, our builder
          will guide you through.
        </p>
        <Link href={"#idt__main-section"}>
          <Button className="mt-4">
            <p>Start Build!</p>
          </Button>
        </Link>
      </div>
      <div>
        <img
          src="https://idealtech.com.my/wp-content/uploads/2023/03/Artboard-26-1.png"
          alt="hero-graphic"
          className="
          w-60 py-8
          xs:py-0 xs:w-80"
        />
      </div>
    </div>
  );
}
