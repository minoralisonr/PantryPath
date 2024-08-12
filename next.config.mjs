/** @type {import('next').NextConfig} */
import { defineConfig } from 'next';
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
};
export default defineConfig(nextConfig);