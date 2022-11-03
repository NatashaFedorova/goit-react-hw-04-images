import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import { useState } from 'react';
import { Item, Img } from './ImageGalleryItem.styled';

const ImageGalleryItem = ({ item }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  return (
    <Item onClick={toggleModal}>
      <Img src={item.webformatURL} alt={item.tags} />
      {showModal && <Modal item={item} onClose={toggleModal} />}
    </Item>
  );
};
export default ImageGalleryItem;

ImageGalleryItem.propTyps = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tags: PropTypes.string.isRequired,
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
};
