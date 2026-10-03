import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-alt">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
