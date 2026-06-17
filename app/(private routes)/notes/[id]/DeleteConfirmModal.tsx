import Modal from '@/components/Modal/Modal';
import css from './DeleteConfirmModal.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
  isPending: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
  isPending,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className={css.container}>
        <div className={css.icon}>⚠️</div>
        <h2 className={css.title}>Delete Note</h2>
        <p className={css.message}>
          Are you sure you want to delete the note <strong>&quot;{noteTitle}&quot;</strong>?
        </p>
        <p className={css.warning}>This action cannot be undone.</p>
        <div className={css.actions}>
          <button
            className={css.cancelButton}
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            className={css.deleteButton}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
