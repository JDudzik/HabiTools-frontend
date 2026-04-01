const { withPostHogConfig } = require('@posthog/nextjs-config');

const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development' || process.env.ENABLE_PWA === 'false',
  dest: 'public',
});

const nextConfig = {
  // next.js config
  output: 'export',
  trailingSlash: true,
};


module.exports = withPostHogConfig(withPWA(nextConfig), {
  envId: process.env.POSTHOG_ENV_ID, // Environment ID
  personalApiKey: process.env.POSTHOG_SOURCEMAPS_API_KEY, // Personal API Key
  // host: 'https://us.posthog.com', // (optional), defaults to https://us.posthog.com
  sourcemaps: { // (optional)
    enabled: process.env.NODE_ENV === 'production'
      && !!process.env.POSTHOG_SOURCEMAPS_API_KEY
      && !!process.env.POSTHOG_ENV_ID,
    // project: 'NEW_APP', // (optional) Project name, defaults to repository name
    // version: '1.0.0', // (optional) Release version, defaults to current git commit
    // deleteAfterUpload: true, // (optional) Delete sourcemaps after upload, defaults to true
  },
});