import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserServer } from '@/lib/api/serverApi';
import css from './page.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'NoteHub | Profile',
  description: 'Review your NoteHub profile details and manage your account.',
};

const ProfilePage = async () => {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt={`${user.username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
