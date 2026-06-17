import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface PageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = 'https://notehub-app.vercel.app';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
  const note = await fetchNoteByIdServer(id);
    const contentPreview = note.content.trim();
    const truncatedContent =
      contentPreview.length > 0
        ? contentPreview.length > 157
          ? `${contentPreview.slice(0, 157)}...`
          : contentPreview
        : `Read the "${note.title}" note on NoteHub.`;
    const url = `${baseUrl}/notes/${encodeURIComponent(id)}`;

    return {
      title: `NoteHub | ${note.title}`,
      description: truncatedContent,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `NoteHub | ${note.title}`,
        description: truncatedContent,
        url,
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
  } catch {
    notFound();
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
