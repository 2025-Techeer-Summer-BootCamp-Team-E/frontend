import { useState } from "react";
import Books_Selected from "../assets/Icons/Books_Selected.svg";
import Books_Nonselected from "../assets/Icons/Books_NonSelected.svg";
import MyVlog_Selected from "../assets/Icons/MyVlog_Selected.svg";
import MyVlog_Nonselected from "../assets/Icons/MyVlog_NonSelected.svg";

const Toggle = () => {
  const [selected, setSelected] = useState<"books" | "vlog">("books");

  return (
    <div className="flex gap-[3.5rem] p-2 rounded-full">
      {/* Books 버튼 */}
      <button
        onClick={() => setSelected("books")}
        className={`w-[180px] h-[56px] rounded-full flex items-center justify-center gap-[1rem]
        font-crimson text-[24px] font-bold shadow-[0_0_8px_rgba(0,0,0,0.25)]
        ${selected === "books" ? "bg-[#DCAC62] text-black" : "bg-[#F8F3ED] text-[#414141]"}`}
      >
        <img
          src={selected === "books" ? Books_Selected : Books_Nonselected}
          alt="Books"
          className="w-[26px] h-[23.84px]"
        />
        Books
      </button>

      {/* My Vlog 버튼 */}
      <button
        onClick={() => setSelected("vlog")}
        className={`w-[206px] h-[56px] rounded-full flex items-center justify-center gap-[1rem]
        font-crimson text-[24px] font-bold shadow-[0_0_8px_rgba(0,0,0,0.25)]
        ${selected === "vlog" ? "bg-[#DCAC62] text-black" : "bg-[#F8F3ED] text-[#414141]"}`}
      >
        <img
          src={selected === "vlog" ? MyVlog_Selected : MyVlog_Nonselected}
          alt="My Vlog"
          className="w-[25px] h-[26.73px]"
        />
        My Vlog
      </button>
    </div>
  );
};

export default Toggle;
