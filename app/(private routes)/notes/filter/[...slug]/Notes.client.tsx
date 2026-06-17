'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import type { NoteTag } from '@/types/note';
import css from './Notes.module.css';

interface NotesClientProps {
  tag: NoteTag | 'All';
}

const NOTES_PER_PAGE = 12;

const NotesClient = ({ tag }: NotesClientProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', tag, currentPage, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: NOTES_PER_PAGE,
        search: debouncedSearch,
        tag: tag === 'All' ? undefined : tag,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  if (isLoading) return <div>Loading, please wait...</div>;
  if (isError) return <div>Error loading notes: {error?.message || 'Unknown error'}</div>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {data && data.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data && data.notes && data.notes.length === 0 && (
        <div className={css.emptyState}>
          <p>No notes found. Create your first note!</p>
        </div>
      )}
    </div>
  );
};

export default NotesClient;
