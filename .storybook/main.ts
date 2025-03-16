import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y', // https://storybook.js.org/docs/writing-tests/accessibility-testing#configure
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        /**
         * Experimental SWC support
         * See: https://storybook.js.org/recipes/next#experimental-swc-support
         */
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  // eslint-disable-next-line @typescript-eslint/require-await
  async webpackFinal(webpackConfig) {
    const imageRule = webpackConfig.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;
      if (!test) return false;
      return test.test('.svg');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as { [key: string]: any };

    imageRule['exclude'] = /\.svg$/;

    webpackConfig.module?.rules?.unshift({
      test: /\.svg$/,
      loader: '@svgr/webpack',
      options: {
        dimensions: false,
        accessibilityRole: 'image',
        svgProps: { role: 'img' },
        svgoConfig: {
          plugins: [
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ 'aria-hidden': 'true' }, { focusable: 'false' }],
              },
            },
          ],
        },
      },
    });
    return webpackConfig;
  },
};
export default config;
