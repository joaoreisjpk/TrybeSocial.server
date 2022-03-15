/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    URL: 'http://localhost:3333',
    JWT_SECRET: 'paçocapaçoquinha'
  }
}

module.exports = nextConfig
