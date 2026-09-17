import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoyaltyProvider } from './context/LoyaltyContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Reservations from './pages/Reservations';
import About from './pages/About';
import OrderOnline from './pages/OrderOnline';
import Loyalty from './pages/Loyalty';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ManageMenu from './admin/ManageMenu';
import ManageReservations from './admin/ManageReservations';
import ManageOrders from './admin/ManageOrders';
import ManageBlog from './admin/ManageBlog';
import ManageGallery from './admin/ManageGallery';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a0e06',
            color: '#fff',
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#c0392b',
              secondary: '#fff',
            },
          },
        }}
      />

      <AuthProvider>
        <CartProvider>
          <LoyaltyProvider>
            <Routes>

              {/* Public Routes with Navbar/Footer */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="about" element={<About />} />
                <Route path="order" element={<OrderOnline />} />
                <Route path="loyalty" element={<Loyalty />} />
                <Route path="blog" element={<Blog />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* Admin Login (Standalone) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes with Sidebar */}
              <Route path="/admin" element={<AdminLayout />}>
                {/* Default redirect to dashboard or login handled in components */}
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="menu" element={<ManageMenu />} />
                <Route path="reservations" element={<ManageReservations />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="blog" element={<ManageBlog />} />
                <Route path="gallery" element={<ManageGallery />} />
              </Route>

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </LoyaltyProvider>
        </CartProvider>
      </AuthProvider>

    </BrowserRouter>
  );
};

export default App;
