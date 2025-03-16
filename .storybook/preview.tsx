import type { Preview } from '@storybook/react';
import React from 'react';

import { inter } from '../src/app/styles/fonts';

import '../src/app/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {},
  decorators: [
    (Story) => {
      return <div className={`${inter.variable}`}>{Story()}</div>;
    },
  ],
};

// eslint-disable-next-line import/no-default-export
export default preview;
