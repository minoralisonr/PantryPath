/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withMobileResponsiveImages = require('next-images/next-image-loader');

module.exports = withMobileResponsiveImages({
  esModule: true,
  ...nextConfig, 
});