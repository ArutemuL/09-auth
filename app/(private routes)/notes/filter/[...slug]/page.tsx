import type { Metadata } from 'next';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { fetchNotesServer } from '@/lib/api/serverApi';
import { NOTE_TAGS, type NoteTag } from '@/types/note';
import NotesClient from './Notes.client';

export const dynamic = 'force-dynamic';

const NOTES_PER_PAGE = 12;

type PageParams = {
  slug?: string[];
};

type PageProps = {
  params: Promise<PageParams>;
};

const baseUrl = 'https://notehub-app.vercel.app';

const getTagFromSlug = (slug?: string[]): NoteTag | 'All' => {
  if (!slug || slug.length === 0) {
    return 'All';
  }

  if (slug.length > 1) {
    return notFound();
  }

  const [tagCandidate] = slug;

  if (tagCandidate === 'All') {
    return 'All';
  }

  if (NOTE_TAGS.includes(tagCandidate as NoteTag)) {
    return tagCandidate as NoteTag;
  }

  return notFound();
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);

  const tagLabel = tag === 'All' ? 'All notes' : `${tag} notes`;
  const description =
    tag === 'All'
      ? 'Browse all notes and stay organised with NoteHub filters.'
      : `Browse NoteHub notes tagged "${tag}" and stay organised with focused filters.`;
  const path =
    tag === 'All' || !slug?.length
      ? '/notes/filter'
      : `/notes/filter/${encodeURIComponent(slug[0]!)}`;

  return {
    title: `NoteHub | ${tagLabel}`,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
    openGraph: {
      title: `NoteHub | ${tagLabel}`,
      description,
      url: `${baseUrl}${path}`,
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
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTagFromSlug(slug);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag, 1, ''],
    queryFn: () =>
      fetchNotesServer({
        page: 1,
        perPage: NOTES_PER_PAGE,
        search: '',
        tag: tag === 'All' ? undefined : tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
