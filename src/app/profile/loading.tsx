import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </main>
      <Footer />
    </div>
  );
}
