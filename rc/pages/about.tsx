import dynamic from 'next/dynamic';

const AboutRoute = dynamic(() => import('../src/next/AboutRoute'), {
  ssr: false,
});

export default function AboutPage() {
  return <AboutRoute />;
}
