import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { create } from '@storybook/theming';

// Import theme system
import '../src/theme/index.css';

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
});

// Create Holland & Barrett theme for docs
const theme = create({
  base: 'light',
  brandTitle: 'Holland & Barrett',
  brandUrl: 'https://www.hollandandbarrett.com',
  brandImage: './hb-logo.svg',
  brandTarget: '_blank',

  // Colors
  colorPrimary: '#7bb300',
  colorSecondary: '#0f6a5b',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e0e0e0',
  appBorderRadius: 4,

  // Text colors
  textColor: '#1f2a2e',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#1f2a2e',
  barSelectedColor: '#7bb300',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e0e0e0',
  inputTextColor: '#1f2a2e',
  inputBorderRadius: 4,
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme,
    },
  },
  loaders: [mswLoader],
};

export default preview;
