'use client';

import { useRouter } from 'next/navigation';
import css from './page.module.css';

const BackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button type="button" className={css.backButton} onClick={handleClick}>
      Back
    </button>
  );
};

export default BackButton;
