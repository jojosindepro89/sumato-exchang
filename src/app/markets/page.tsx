import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import MarketsPage from './MarketsPage';

export const metadata: Metadata = {
  title: 'Markets | Sumato Exchange',
  description: 'Real-time cryptocurrency prices, market caps, 24h changes, and trading volumes for 350+ cryptocurrencies.',
};

export default function Page() {
  return (
    <>
      <Navbar />
      <MarketsPage />
    </>
  );
}
