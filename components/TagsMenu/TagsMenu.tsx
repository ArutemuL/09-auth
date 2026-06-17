"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { NoteTag } from "../../types/note";

type TagType = NoteTag | "All";

const TagsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  const tags: TagType[] = [
    "All",
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={toggle}
        className="relative !px-[6px] !py-[4px] text-white text-[16px] bg-blue-600 rounded z-0 transition-colors hover:bg-blue-700 active:bg-blue-700 glow-button"
      >
        <span className="relative z-10 px-[3px] py-[12px]">Notes ▾</span>
        <span className="absolute inset-0 rounded bg-blue-600 z-[-1] glow-base px-[3px] py-[12px]"></span>
        <span className="absolute -top-[2px] -left-[2px] w-[calc(100%+4px)] h-[calc(100%+4px)] rounded z-[-1] glow-overlay px-[3px] py-[12px]"></span>
      </button>

      {isOpen && (
        <ul className="absolute top-[calc(100%+6px)] left-0 !px-[6px] !py-[6px] bg-blue-600 border border-gray-300 rounded-lg shadow-lg  list-none z-[1000]">
          {tags.map((el) => (
            <li key={el}>
              <Link
                href={
                  el === "All" ? "/notes/filter/All" : `/notes/filter/${el}`
                }
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-[#f0f0f0] text-[15px] no-underline hover:bg-[#65aff4] transition-colors"
              >
                {el}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
