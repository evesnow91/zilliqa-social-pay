import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createGlobalStyle } from 'styled-components';

import { Carousel } from 'react-responsive-carousel';
import { GuideContainer } from 'components/guide-container';

const CAROUSEL_PROPS = {
  showArrows: false,
  showStatus: false,
  showThumbs: false,
  showIndicators: false,
  emulateTouch: true,
  useKeyboardArrows: true
};
const SLIDES = [
  {
    img: 'guide-1.svg',
    text: 'SocialPay is an innovative new solution that allows you to earn $ZIL by sharing social media updates on Twitter. To use SocialPay you need to login with your Twitter account and use specific hashtags in your tweets.'
  },
  {
    img: 'guide-2.svg',
    text: 'Every time you publish Zilliqa-related tweets, you are able to earn reward. These rewards can vary depending on the campaign Zilliqa is running. Make sure to always check out what campaign is running while you help Zilliqa grow!'
  }
];

const CarouselStyle = createGlobalStyle`
  .carousel .slide {
    background: transparent;
  }
`;

export const GuidePage: NextPage = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = React.useState<number>(0);

  const handeNextSlide = React.useCallback((index: number) => {
    if (index < SLIDES.length) {
      setSelectedItem(index);

      return null;
    }

    router.push('/auth');
  }, [setSelectedItem]);

  return (
    <React.Fragment>
      <Carousel
        {...CAROUSEL_PROPS}
        selectedItem={selectedItem}
        onChange={setSelectedItem}
      >
        {SLIDES.map((sldie, index) => (
          <GuideContainer
            key={index}
            imgSrc={`/imgs/${sldie.img}`}
            text={sldie.text}
            onNext={() => handeNextSlide(index + 1)}
          />
        ))}
      </Carousel>
      <CarouselStyle />
    </React.Fragment>
  );
}

export default GuidePage;