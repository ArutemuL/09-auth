'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError, type AxiosError } from 'axios';
import { updateUser } from '@/lib/api/clientApi';
import { useAuthStore, type AuthState } from '@/lib/store/authStore';
import type { UpdateUserRequest } from '@/types/auth';
import type { User } from '@/types/user';
import css from './page.module.css';

type Props = {
  user: User;
};

type UpdateUserError = {
  message?: string;
  error?: string;
};

const EditProfileForm = ({ user }: Props) => {
  const router = useRouter();
  const setUser = useAuthStore((state: AuthState) => state.setUser);
  const [username, setUsername] = useState(user.username);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    const payload: UpdateUserRequest = {
      username: username.trim(),
    };

    try {
      setIsSubmitting(true);
      const updatedUser = await updateUser(payload);
      setUser(updatedUser);
      router.push('/profile');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<UpdateUserError>;
        const responseData = axiosError.response?.data;
        const message =
          responseData?.message ||
          responseData?.error ||
          axiosError.message ||
          'Failed to update profile. Please try again.';
        setError(message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.profileCard} onSubmit={handleSubmit} noValidate>
      <h1 className={css.formTitle}>Edit profile</h1>
      <div className={css.profileInfo}>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <div className={css.usernameWrapper}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className={css.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={3}
            maxLength={50}
            required
          />
        </div>
      </div>

      {error && <p className={css.error}>{error}</p>}

      <div className={css.actions}>
        <button type="submit" className={css.saveButton} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
