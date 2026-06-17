"use client";

import { useState, useTransition, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import type { CreateNoteRequest, NoteTag } from "@/types/note";
import { NOTE_TAGS } from "@/types/note";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

type FieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

type ValidationErrors = Partial<Record<keyof CreateNoteRequest, string>> & {
  submit?: string;
};

const MAX_CONTENT_LENGTH = 500;

const validate = (values: CreateNoteRequest): ValidationErrors => {
  const errors: ValidationErrors = {};
  const trimmedTitle = values.title.trim();

  if (trimmedTitle.length < 3) {
    errors.title = "Заголовок має містити мінімум 3 символи";
  } else if (trimmedTitle.length > 50) {
    errors.title = "Заголовок має містити максимум 50 символів";
  }

  if (values.content.length > MAX_CONTENT_LENGTH) {
    errors.content = "Контент має містити максимум 500 символів";
  }

  if (!NOTE_TAGS.includes(values.tag)) {
    errors.tag = "Недійсний тег";
  }

  return errors;
};

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isPendingTransition, startTransition] = useTransition();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const resetErrorsForField = useCallback((name: keyof CreateNoteRequest) => {
    setErrors((prev) => {
      if (!prev[name] && !prev.submit) {
        return prev;
      }
      const updated = { ...prev };
      delete updated[name];
      if (updated.submit) {
        delete updated.submit;
      }
      return updated;
    });
  }, []);

  const handleChange = useCallback(
    (event: FieldChangeEvent) => {
      const { name, value } = event.target;
      const fieldName = name as keyof CreateNoteRequest;

      const nextValue =
        fieldName === "tag" ? (value as NoteTag) : (value as string);

      setDraft({ [fieldName]: nextValue } as Partial<CreateNoteRequest>);
      resetErrorsForField(fieldName);
    },
    [resetErrorsForField, setDraft]
  );

  const formAction = useCallback(
    async (formData: FormData) => {
      const rawTitle = (formData.get("title") as string | null) ?? "";
      const rawContent = (formData.get("content") as string | null) ?? "";
      const rawTag = (formData.get("tag") as string | null) ?? initialDraft.tag;

      const payload: CreateNoteRequest = {
        title: rawTitle.trim(),
        content: rawContent,
        tag: (NOTE_TAGS.includes(rawTag as NoteTag)
          ? rawTag
          : initialDraft.tag) as NoteTag,
      };

      const validationErrors = validate(payload);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});

      try {
        await mutation.mutateAsync(payload);
        clearDraft();

        startTransition(() => {
          router.back();
        });
      } catch (error) {
        console.error("Failed to create note", error);
        setErrors({ submit: "Failed to create the note. Please try again." });
      }
    },
    [clearDraft, mutation, router, startTransition]
  );

  const handleCancel = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router, startTransition]);

  const isSubmitting = mutation.isPending || isPendingTransition;

  return (
    <form className={css.form} action={formAction} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          placeholder="Enter note title"
          required
        />
        <span className={css.error}>{errors.title}</span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          placeholder="Write your note here"
          maxLength={MAX_CONTENT_LENGTH}
        />
        <span className={css.error}>{errors.content}</span>
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span className={css.error}>{errors.tag}</span>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          Create note
        </button>
      </div>

      {errors.submit && <span className={css.error}>{errors.submit}</span>}
    </form>
  );
};

export default NoteForm;
