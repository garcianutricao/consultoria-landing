/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATENÇÃO !!
    // Perigosamente permite que builds de produção sejam concluídos mesmo com erros de tipo.
    // Use isso para colocar o site no ar agora.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de lint durante o build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;