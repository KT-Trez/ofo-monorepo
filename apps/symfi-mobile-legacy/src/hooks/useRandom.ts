import { useCallback } from 'react';

const RANDOM_IMAGE_PATHS = [
  require('../../assets/cover-placeholders/cover-0.jpg'),
  require('../../assets/cover-placeholders/cover-1.jpg'),
  require('../../assets/cover-placeholders/cover-2.jpg'),
  require('../../assets/cover-placeholders/cover-3.jpg'),
  require('../../assets/cover-placeholders/cover-4.jpg'),
  require('../../assets/cover-placeholders/cover-5.jpg'),
  require('../../assets/cover-placeholders/cover-6.jpg'),
  require('../../assets/cover-placeholders/cover-7.jpg'),
  require('../../assets/cover-placeholders/cover-8.jpg'),
  require('../../assets/cover-placeholders/cover-9.jpg'),
  require('../../assets/cover-placeholders/cover-10.jpg'),
  require('../../assets/cover-placeholders/cover-11.jpg'),
  require('../../assets/cover-placeholders/cover-12.jpg'),
  require('../../assets/cover-placeholders/cover-13.jpg'),
  require('../../assets/cover-placeholders/cover-14.jpg'),
  require('../../assets/cover-placeholders/cover-15.jpg'),
  require('../../assets/cover-placeholders/cover-16.jpg'),
  require('../../assets/cover-placeholders/cover-17.jpg'),
  require('../../assets/cover-placeholders/cover-18.jpg'),
  require('../../assets/cover-placeholders/cover-19.jpg'),
];

export const useRandom = () => {
  const randomId = useCallback(() => {
    return new Date().getTime() + Math.round(Math.random() * 1000).toString();
  }, []);

  const randomInt = useCallback((min: number, max: number, inclusive?: boolean) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return inclusive
      ? Math.floor(Math.random() * (max - min + 1) + min)
      : Math.floor(Math.random() * (max - min) + min);
  }, []);

  const randomImage = useCallback(() => {
    return RANDOM_IMAGE_PATHS[randomInt(0, RANDOM_IMAGE_PATHS.length - 1, true)];
  }, [randomInt]);

  return { randomId, randomImage, randomInt };
};
