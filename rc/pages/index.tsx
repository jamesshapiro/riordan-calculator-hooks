import dynamic from 'next/dynamic';

const HomeRoute = dynamic(() => import('../src/next/HomeRoute'), {
  ssr: false,
});

export default function IndexPage() {
  return <HomeRoute />;
}
