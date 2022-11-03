import { useState } from 'react';
import { getGallery } from './services/api';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'components/Modal';
import Header from './Header';
import Section from './Section';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import BtnLoadMore from './BtnLoadMore';
import Loading from './Loading';
import { Background } from 'components/constants/Base.styled';
import { useEffect } from 'react';

const errorStyle = {
  style: {
    color: '#fff',
    background: 'red',
  },
};

const messageStyle = {
  style: {
    color: '#fff',
    background: '#48909b',
  },
};

export const App = () => {
  const [gallery, setGallery] = useState([]);
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState({});

  useEffect(() => {
    if (message && totalImages > 0) {
      toast.success(message, messageStyle);
    }
  }, [message, totalImages]);

  useEffect(() => {
    if (error) {
      toast.error(error, errorStyle);
    }
  }, [error]);

  useEffect(() => {
    if (page > 1) {
      return;
    }
    if (value === '') {
      return;
    }
    const fetchGalleryAfterChangeValue = async () => {
      try {
        setIsLoading(true);
        const { hits, totalHits } = await getGallery(value, page);
        if (hits.length === 0) {
          setError('Nothing was found for this request :(');
        }
        setGallery(hits);
        setTotalImages(totalHits);
        setIsLoadMore(true);
        setMessage(`Hooray! We found ${totalHits} images.`);
      } catch (error) {
        setError(
          'Oops! Something went wrong :( please, try reloading the page'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleryAfterChangeValue();
  }, [value, page]);

  useEffect(() => {
    if (page === 1) {
      return;
    }

    if (value === '') {
      return;
    }
    const fetchGalleryAfterChangePage = async () => {
      try {
        setIsLoading(true);
        setIsLoadMore(false);
        const { hits } = await getGallery(value, page);
        if (hits.length === 0) {
          setError('Nothing was found for this request :(');
        }
        setGallery(prevState => [...prevState, ...hits]);
        setIsLoadMore(true);
        if (gallery.length === totalImages) {
          setMessage('All available images are loaded');
        }
      } catch (error) {
        setError(
          'Oops! Something went wrong :( please, try reloading the page'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryAfterChangePage();
  }, [page, value, totalImages, gallery]);

  useEffect(() => {
    setShowModal(prevState => !prevState);
  }, [selectedGalleryItem]);

  const changeValue = value => {
    setValue(value);
    setGallery([]);
    setError(null);
    setMessage(null);
  };

  const changePage = () => {
    setPage(prevState => prevState + 1);
    setError(null);
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const getImgByItemId = id => {
    setSelectedGalleryItem(gallery.find(item => item.id === id));
  };

  const galleryVisibility = gallery.length > 0;

  const btnLoadMoreVisibility =
    isLoadMore && totalImages !== gallery.length && gallery.length !== 0;

  return (
    <Background>
      <Header>
        <Searchbar onSubmit={changeValue} />
      </Header>
      <Section>
        {galleryVisibility > 0 && (
          <ImageGallery gallery={gallery} onChange={getImgByItemId} />
        )}
        {isLoading && <Loading />}
        {btnLoadMoreVisibility && <BtnLoadMore onClick={changePage} />}
        {showModal && (
          <Modal item={selectedGalleryItem} onClose={toggleModal} />
        )}
      </Section>
      <Toaster position="top-right" />
    </Background>
  );
};
