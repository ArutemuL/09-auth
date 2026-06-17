import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserServer } from '@/lib/api/serverApi';
import EditProfileForm from './EditProfileForm.client';
import css from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'NoteHub | Edit profile',
  description: 'Update your NoteHub profile details.',
};

const EditProfilePage = async () => {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <EditProfileForm user={user} />
    </main>
  );
};

export default EditProfilePage;
