import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Backdrop, ModalBox, Img } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ item, onClose }) => {
  const onClickBackdrop = e => {
    console.log(e.currentTarget);
    if (e.currentTarget !== e.target) {
      onClose();
    }
  };

  useEffect(() => {
    const onKeydown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [onClose]);

  return createPortal(
    <Backdrop onClick={onClickBackdrop}>
      <ModalBox>
        <Img src={item.largeImageURL} alt={item.tags} />
      </ModalBox>
    </Backdrop>,
    modalRoot
  );
};

export default Modal;
