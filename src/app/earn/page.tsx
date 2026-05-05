import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import EarnPage from './EarnPage';

export const metadata: Metadata = {
  title: 'Simple Earn | Sumato Exchange',
  description: 'Earn daily rewards on your crypto holdings. Flexible and locked savings with up to 23% APY.',
};

export default function Page() {
  return (
    <>
      <Navbar />
      <EarnPage />
      <Footer />
    </>
  );
}
