//components / SidebarNotes / SidebarNotes.tsx;

// import Link from "next/link";
import css from "./SidebarNotes.module.css";
import AnimatedLink from "./AnimatedLink/AnimatedLink";
import { NoteTag } from "@/types/note";

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
