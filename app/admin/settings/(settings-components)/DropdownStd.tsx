import React from "react";
import { Options } from "../page";

type Props = {
  boxSize: number;
  buttonId: string;
  options: Options[];
  values: string;
  setOpenClose: (id: string, newValue: boolean) => void;
  openClose: boolean;
  setInput: React.MutableRefObject<string>;
  updateDB: () => void;
};

const Dropdown = ({
  boxSize,
  buttonId,
  options,
  values,
  setOpenClose,
  openClose,
  setInput,
  updateDB,
}: Props) => {
  return (
    <div
      role="button"
      className={`max-w-[${boxSize}px] whitespace-nowrap relative px-2 py-1`}
      onClick={() => setOpenClose(buttonId, true)}
    >
      {options &&
        options.map((options, key) => {
          // console.log(options.option, values);
          if (options.option === values)
            return (
              <div
                key={key}
                role="button"
                className={`rounded-md w-max px-2 ${options.color} h-full`}
              >
                <p className="min-h-[24px]">{values}</p>
              </div>
            );
        })}
      {openClose && (
        <div className="z-[2] absolute w-full left-0 top-0 py-2 flex flex-col rounded-md bg-zinc-800">
          {options &&
            options.map((options, key) => {
              return (
                <div
                  key={key}
                  role="button"
                  className="row-cont px-2 py-1 mobilehover:hover:bg-zinc-700"
                  onClick={() => {
                    setInput.current = options.option;
                    updateDB();
                    setTimeout(() => {
                      setOpenClose(buttonId, false);
                    }, 50);
                  }}
                >
                  <div
                    className={`${options.color} rounded-md w-max leading-none px-2 py-[2px]`}
                  >
                    <span>{options.option}</span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
