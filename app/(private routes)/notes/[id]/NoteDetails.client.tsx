// app>(private router)>notes>[id]>Notedatailis.clilent.tsx

"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNoteById, deleteNote } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import NoteEditForm from "./NoteEditForm";
import DeleteConfirmModal from "./DeleteConfirmModal";
import css from "./NoteDetails.module.css";

const NoteDetailsClient = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleNavigateBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/notes/filter/All");
  }, [router]);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      handleNavigateBack();
    },
  });

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <button
        className={css.backButton}
        onClick={handleNavigateBack}
        aria-label="Back to notes"
      >
        ← Back to Notes
      </button>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <div className={css.actions}>
            <button
              className={css.editButton}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </button>
            <button
              className={css.deleteButton}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <p className={css.date}>
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <NoteEditForm
            note={note}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        noteTitle={note.title}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};

export default NoteDetailsClient;
