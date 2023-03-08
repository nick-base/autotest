const path = require('path');
const webpack = require('webpack');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles/common')],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __COMPONENTS_REBUILD_TIME__: webpack.DefinePlugin.runtimeValue(Date.now, {
          contextDependencies: [path.resolve(__dirname, 'src/components/')],
        }),
      })
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
