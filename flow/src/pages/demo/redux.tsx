import Demo from '@/shared/components/demo';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <div>
      <div>
        <Link href="/demo/about">About</Link>
      </div>
      <Demo />
    </div>
  );
};

export default IndexPage;
