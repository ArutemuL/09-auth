import { create, type StoreApi } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

export type NoteDraft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

const createInitialDraft = (): NoteDraft => ({ ...initialDraft });

type NoteStore = {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
};

type NoteStorePersist = PersistOptions<NoteStore, Pick<NoteStore, 'draft'>>;

type SetState = StoreApi<NoteStore>['setState'];

const noteStoreCreator = (set: SetState): NoteStore => ({
  draft: createInitialDraft(),
  setDraft: (note: Partial<NoteDraft>) =>
    set((state) => ({
      draft: { ...state.draft, ...note },
    })),
  clearDraft: () => set({ draft: createInitialDraft() }),
});

export const useNoteStore = create<NoteStore>()(
  persist<NoteStore, [], [], Pick<NoteStore, 'draft'>>(noteStoreCreator, {
    name: 'notehub-note-draft',
    partialize: (state) => ({ draft: state.draft }),
  } satisfies NoteStorePersist)
);
