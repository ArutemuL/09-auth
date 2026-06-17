'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NotePreview.module.css';

type NotePreviewProps = {
  noteId: string;
};

const NotePreview = ({ noteId }: NotePreviewProps) => {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  const note = data;

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose} contentClassName={css.modalContent}>
        <div className={css.container}>
          <p>Loading note...</p>
        </div>
      </Modal>
    );
  }

  if (isError || !note) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unable to load note. Please try again later.';

    return (
      <Modal onClose={handleClose} contentClassName={css.modalContent}>
        <div className={css.container}>
          <p className={css.content}>{errorMessage}</p>
          <button type="button" className={css.backBtn} onClick={handleClose}>
            ← Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose} contentClassName={css.modalContent}>
      <div className={css.container}>
        <button type="button" className={css.backBtn} onClick={handleClose}>
          ← Back
        </button>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreview;
