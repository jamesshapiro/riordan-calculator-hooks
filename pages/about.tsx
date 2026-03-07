import dynamic from 'next/dynamic';

const AboutPage = dynamic(() => import('../src/next/pages/AboutPage'), {
  ssr: false,
});

export default AboutPage;
