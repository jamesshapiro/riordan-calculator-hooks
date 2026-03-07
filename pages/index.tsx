import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('../src/next/pages/HomePage'), {
  ssr: false,
});

export default HomePage;
