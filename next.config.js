import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import("next").NextConfig} */
const config = {
  webpack(config) {
    config.module.rules.push({
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
    config.externals = [...config.externals, 'canvas', 'jsdom'];

    return config;
  },
  env: {},
};

export default withNextIntl(config);
