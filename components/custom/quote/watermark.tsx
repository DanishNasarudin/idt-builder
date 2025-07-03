export default function Watermark() {
  return (
    <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-full z-[20] opacity-15">
      <p className="text-[120px] font-bold text-foreground-500 text-nowrap rotate-[-5deg] text-center">
        IDEAL TECH PC
      </p>
    </div>
  );
}
