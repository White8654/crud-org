/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const nextConfig = {};

const moduleExports = {
    // Your existing Next.js config here
  };
  
  const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin.
    silent: true, // Suppresses all logs
  };
  
  module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);