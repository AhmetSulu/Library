import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Spinner from '../common/Spinner';

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      {/* Main content area with loading fallback */}
      <main className="main-content">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}