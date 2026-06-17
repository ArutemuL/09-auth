"use client";

import { type NoteTag } from "@/types/note";
import css from "./SidebarNotes.module.css";
import AnimatedLink from "@/components/SidebarNotes/AnimatedLink/AnimatedLink";

type TagType = NoteTag | "All";

const SidebarNotesComponent = () => {
  const tags: TagType[] = [
    "All",
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];

  return (
    <div>
      <ul className={css.menuList}>
        {tags.map((el) => (
          <li className={css.menuItem} key={el}>
            <AnimatedLink
              href={`/notes/filter/${el}`}
              text={el}
              className={css.menuLink}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarNotesComponent;
