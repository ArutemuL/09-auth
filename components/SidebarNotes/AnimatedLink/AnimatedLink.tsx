//components / SidebarNotes /AnimatedLink/AnimatedLink.tsx;

import styles from "./AnimatedLink.module.scss";
import Link from "next/link";

type Props = {
  href: string;
  text: string;
  className?: string;
};

const AnimatedLink = ({ href, text, className = "" }: Props) => {
  const letters = text
    .trim()
    .split("")
    .map((char, i) => <span key={i}>{char === " " ? "\u00A0" : char}</span>);

  return (
    <Link href={href} className={`${styles.link} ${className}`}>
      <div className={styles.text}>{letters}</div>
      <div className={styles.svg}>
        <svg preserveAspectRatio="none" viewBox="0 0 192 5">
          <path d="M191.246 4H129C129 4 127.781 4.00674 127 4C114.767 3.89447 108.233 1 96 1C83.7669 1 77.2327 3.89447 65 4C64.219 4.00674 63 4 63 4H0.751923" />
        </svg>
      </div>
    </Link>
  );
};

export default AnimatedLink;
