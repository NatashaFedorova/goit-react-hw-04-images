import { useState } from 'react';
import { getGallery } from './services/api';
import { Toaster } from 'react-hot-toast';

import Header from './Header';
import Section from './Section';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import BtnLoadMore from './BtnLoadMore';
import Loading from './Loading';
import { Background } from 'components/constants/Base.styled';
import { useEffect } from 'react';
import {
  searchError,
  fetchError,
  messageAboutTotal,
} from 'components/notify/notify';

export const App = () => {
  const [gallery, setGallery] = useState([]);
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          searchError();
          return;
        }
        setGallery(hits);
        setTotalImages(totalHits);
        setIsLoadMore(true);
        messageAboutTotal(totalHits);
      } catch (error) {
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
          fetchError();
          return;
        }
        setGallery(prevState => [...prevState, ...hits]);
        setIsLoadMore(true);
      } catch (error) {
        fetchError();
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryAfterChangePage();
  }, [page, value]);

  const changeValue = value => {
    setValue(value);
    setGallery([]);
  };

  const changePage = () => {
    setPage(prevState => prevState + 1);
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
        {galleryVisibility > 0 && <ImageGallery gallery={gallery} />}
        {isLoading && <Loading />}
        {btnLoadMoreVisibility && <BtnLoadMore onClick={changePage} />}
      </Section>
      <Toaster position="top-right" />
    </Background>
  );
};
