type Props = {};

function Hero({}: Props) {
  return (
    <div
      className="
    flex flex-col items-center justify-between text-center py-4 pt-8
    xs:flex-row xs:text-left sm:py-8"
    >
      <div className="idt__container"></div>
      <div className="w-4/5">
        <h1 className="my-2 xs:my-4">
          Ideal Tech Official <br />
          PC Builder
        </h1>
        <p className="hidden sm:block">
          You have taken a step forward into the Enthusiasts Realm. <br />
          <b className="font-normal text-accent">Calm yourself</b>, our builder
          will guide you through.
        </p>
        <p className="sm:hidden">
          You have taken a step forward into the Enthusiasts Realm.{" "}
          <b className="font-normal text-accent">Calm yourself</b>, our builder
          will guide you through.
        </p>
        <button
          className="
        bg-accent/0 border-[1px] py-2 px-4 rounded-xl my-4 font-bold 
        mobilehover:hover:bg-accent mobilehover:hover:text-black mobilehover:hover:border-transparent transition-all"
        >
          <p>Start Build!</p>
        </button>
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

export default Hero;
