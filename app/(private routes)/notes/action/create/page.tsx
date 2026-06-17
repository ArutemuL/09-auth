import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import SidebarNotes from '@/app/(private routes)/notes/filter/@sidebar/SidebarNotes';
import layoutCss from '@/app/(private routes)/notes/filter/layout.module.css';
import BackButton from './BackButton.client';
import css from './page.module.css';

const pageUrl = 'https://notehub-app.vercel.app/notes/action/create';

export const metadata: Metadata = {
  title: 'NoteHub | Create note',
  description: 'Create a new note in NoteHub to keep your ideas organised.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'NoteHub | Create note',
    description: 'Create a fresh NoteHub note and capture your ideas instantly.',
    url: pageUrl,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub application preview',
      },
    ],
  },
};

const CreateNotePage = () => {
  return (
    <div className={layoutCss.container}>
      <aside className={layoutCss.sidebar}>
        <SidebarNotes />
      </aside>
      <div className={layoutCss.notesWrapper}>
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.header}>
              <BackButton />
              <h1 className={css.title}>Create note</h1>
            </div>
            <NoteForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateNotePage;
