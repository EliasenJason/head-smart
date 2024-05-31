/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.gdenergyproducts.com','lh3.googleusercontent.com','s.gravatar.com' ]
  },
  onDemandEntries: {
    // Support longer than the default 5 seconds
    maxInactiveAge: 60 * 60,
    // Build assets are kept in memory for 60 seconds
    pagesBufferLength: 2,
  },

}
