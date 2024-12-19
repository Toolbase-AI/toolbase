import {
  colorsTuple,
  createTheme,
  type MantineColorsTuple,
} from '@mantine/core';

// FF6F00 -  Orange 6
const primaryOrange: MantineColorsTuple = [
  '#fff2e2',
  '#ffe4cc',
  '#ffc79a',
  '#ffa864',
  '#fe8e37',
  '#fe7d1a',
  '#ff7409',
  '#e46200',
  '#cb5600',
  '#b14800',
];

// F9A825 - 5
const accentYellow: MantineColorsTuple = [
  '#fff6e0',
  '#ffeccb',
  '#fdd89b',
  '#fbc367',
  '#fab13b',
  '#f9a51e',
  '#f99f0b',
  '#de8a00',
  '#c67a00',
  '#ac6900',
];

const backgroundWhite = colorsTuple('#FFFFFF');

const mainTextDarkGray = colorsTuple('#212121');

const secondaryTextDarkGray = colorsTuple('#757575');

const linkOrange = primaryOrange;

const buttonTextWhite = colorsTuple('#FFFFFF');

// const backgroundLight = '#F4E6C3';

export const theme = createTheme({
  fontFamily: 'Poppins, sans-serif',
  fontFamilyMonospace: 'Poppins, sans-serif',
  autoContrast: true,
  primaryColor: 'primaryOrange',
  primaryShade: 6,
  colors: {
    primaryOrange,
    accentYellow,
    backgroundWhite,
    mainTextDarkGray,
    secondaryTextDarkGray,
    linkOrange,
    buttonTextWhite,
  },
});
