import Navbar from '@/components/Navbar/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import PriceTicker from '@/components/PriceTicker/PriceTicker';
import Footer from '@/components/Footer/Footer';
import HomePageClient from '@/components/HomePage/HomePage';

export default function Home() {
  return (
    <>
      <Navbar />
      <AnnouncementBar />
      <div style={{ paddingTop: '96px' }}>
        <PriceTicker />
        <HomePageClient />
        <Footer />
      </div>
    </>
  );
}
