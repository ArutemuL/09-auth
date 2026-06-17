import { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import css from "./NoteList.module.css";
import Link from "next/link";
import { deleteNoteRequest } from "@/lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNoteRequest(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noteHubKey"] });
      toast.success("Success! Deletion was successful");
    },
  });

  const handleDeleteNote = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link className={css.link} href={`/notes/${note.id}`}>
              Detailis
            </Link>
            <button
              onClick={() => handleDeleteNote(note.id)}
              className={css.glowButton}
            >
              <span className={css.inner}>
                <span
                  className={css.label}
                  data-label="Delete"
                  data-hover="🗑️ "
                >
                  Delete
                  <span className={css.labelBackground}></span>
                </span>
              </span>
              <span className={css.background}></span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
