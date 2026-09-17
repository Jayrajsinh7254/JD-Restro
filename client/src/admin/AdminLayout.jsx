import React from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Utensils, CalendarDays, ShoppingBag, FileText, Image as ImageIcon, LogOut, ShieldCheck } from 'lucide-react';

const AdminLayout = () => {
    const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Strict Role-Based Protection: Require authentication on every switch
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Menu', path: '/admin/menu', icon: Utensils },
        { name: 'Reservations', path: '/admin/reservations', icon: CalendarDays },
        { name: 'Live Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Blog Posts', path: '/admin/blog', icon: FileText },
        { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleSwitchToWebsite = async () => {
        await logout();
        navigate('/');
    };

    const handleSignOut = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-cream2 flex text-brown font-sans relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-dark/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-2xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-serif font-black tracking-tighter text-cream2 flex items-baseline">
                        Drizzle<span className="text-red">.Admin</span>
                    </Link>
                    <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        ✕
                    </button>
                </div>

                {/* Admin Status Profile Badge */}
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red text-white flex items-center justify-center font-serif font-bold text-sm shadow-md">
                        {currentUser?.name ? currentUser.name[0] : 'A'}
                    </div>
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white truncate">{currentUser?.name || 'Administrator'}</span>
                            <ShieldCheck size={13} className="text-red shrink-0" />
                        </div>
                        <p className="text-[10px] text-white/50 truncate font-mono">{currentUser?.email || 'admin@drizzle.com'}</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-red text-white shadow-lg shadow-red/25 font-bold'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <button
                        onClick={handleSwitchToWebsite}
                        className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors text-xs font-bold text-left"
                    >
                        &larr; Switch to Main Website
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-white/70 hover:bg-red/20 hover:text-red transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-bold text-sm">Sign Out Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-dark text-white p-4 flex justify-between items-center shadow-md z-30">
                    <Link to="/" className="text-xl font-serif font-black tracking-tighter text-cream2">
                        Drizzle<span className="text-red">.Admin</span>
                    </Link>
                    <button className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={toggleMobileMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                    </button>
                </header>

                {/* Dynamic Content Outlet */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-cream2 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
