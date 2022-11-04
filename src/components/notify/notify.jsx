import toast from 'react-hot-toast';

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

export const searchError = () => {
  toast.error('Nothing was found for this request :(', errorStyle);
};

export const fetchError = () => {
  toast.error(
    'Oops! Something went wrong :( please, try reloading the page',
    errorStyle
  );
};

export const messageAboutTotal = total => {
  toast.success(`Hooray! We found ${total} images.`, messageStyle);
};
