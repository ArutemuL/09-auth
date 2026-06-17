import type { ReactNode } from 'react';
import css from './layout.module.css';

type NotesLayoutProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

const NotesLayout = ({ children, sidebar }: NotesLayoutProps) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
};

export default NotesLayout;
