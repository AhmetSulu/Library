import Modal from '../common/Modal';

const BorrowsModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size="medium"
    >
      <div className="borrows-modal-content">
        {children}
      </div>
    </Modal>
  );
};

export default BorrowsModal;