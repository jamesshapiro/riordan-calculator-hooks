import dynamic from 'next/dynamic';

const PapersRoute = dynamic(() => import('../src/next/PapersRoute'), {
  ssr: false,
});

export default PapersRoute;
