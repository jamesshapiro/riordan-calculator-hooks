import dynamic from 'next/dynamic';

const SequencesRoute = dynamic(() => import('../src/next/SequencesRoute'), {
  ssr: false,
});

export default SequencesRoute;
