import React from 'react';
import styled from 'styled-components';

import { Container } from 'src/components/container';
import { Text } from 'src/components/text';
import { Img } from 'src/components/img';

import { FontSize, Fonts, FontColors, Sides } from 'src/config';

const LeftBarContainer = styled.header`
  height: 100%;
  width: 250px;

  border-right: 1px solid ${FontColors.gray};

  grid-area: left-bar;
`;
const ProfileContainer = styled(Container)`
  padding: 30px;

  background: url(/imgs/circles.svg) no-repeat;
`;
const ItemsContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-around;

  padding-left: 30px;
  padding-right: 30px;
  max-width: 150px;

  cursor: pointer;
`;
const ItemImg = styled(Img)`
  height: 20px;
  width: 20px;
`;

type Prop = {
  profileName: string;
  items: {
    img: string;
    name: string;
  }[];
  onClick?: (index: number) => void;
}

export const LeftBar: React.FC<Prop> = ({
  profileName,
  items,
  onClick = () => null
}) => {
  return (
    <LeftBarContainer>
      <ProfileContainer>
        <Text
          size={FontSize.lg}
          fontColors={FontColors.white}
          fontVariant={Fonts.AvenirNextLTProBold}
          align={Sides.center}
        >
          SocialPay
        </Text>
        <Text
          size={FontSize.lg}
          fontColors={FontColors.white}
          fontVariant={Fonts.AvenirNextLTProDemi}
          align={Sides.center}
        >
          Hello
        </Text>
        <Text
          size={FontSize.md}
          fontColors={FontColors.white}
          fontVariant={Fonts.AvenirNextLTProRegular}
          align={Sides.center}
          nowrap
        >
          {profileName}
        </Text>
      </ProfileContainer>
      {items.map((item, index) => (
        <ItemsContainer
          key={index}
          onClick={() => onClick(index)}
        >
          <ItemImg
            src={item.img}
          />
          <Text
            size={FontSize.sm}
            fontVariant={Fonts.AvenirNextLTProDemi}
            align={Sides.left}
          >
            {item.name}
          </Text>
        </ItemsContainer>
      ))}
    </LeftBarContainer>
  );
};