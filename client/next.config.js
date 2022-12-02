/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    URL: 'http://44.200.247.39:3333',
    JWT_SECRET: 'paçocapaçoquinha'
  }
}

module.exports = nextConfig
