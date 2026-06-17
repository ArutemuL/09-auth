import type { Metadata } from 'next';
import css from './not-found.module.css';

const pageUrl = 'https://notehub-app.vercel.app/not-found';

export const metadata: Metadata = {
  title: 'NoteHub | Page not found',
  description: 'The page you are looking for does not exist in NoteHub.',
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'NoteHub | Page not found',
    description: 'Requested NoteHub page was not found or may have been removed.',
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

const NotFoundPage = () => {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFoundPage;
