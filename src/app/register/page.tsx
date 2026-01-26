import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import RegisterClient from '@/components/register/RegisterClient';

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <div className="min-h-screen flex flex-col">
        <Header />
        <RegisterClient />
        <Footer />
      </div>
    </AuthGuard>
  );
}
