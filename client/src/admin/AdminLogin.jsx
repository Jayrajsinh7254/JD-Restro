import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, KeyRound, ArrowRight, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    // Fields start blank so admin must explicitly provide ID & password on every switch
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            return toast.error('Please enter both Admin ID and Password');
        }

        setIsSubmitting(true);
        const result = await login(email.trim(), password);
        if (result.success) {
            toast.success('Admin authorization granted. Welcome!');
            navigate(from, { replace: true });
        } else {
            toast.error(result.error || 'Invalid credentials. Please verify your Admin ID and password.');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-4 relative overflow-hidden bg-radial-glow">
            <div className="absolute inset-0 bg-dark/60 z-0"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-white inline-flex items-baseline mb-2">
                        Drizzle<span className="text-red">.</span>
                    </Link>
                    <div className="flex items-center justify-center gap-1.5 text-white/60 font-sans uppercase tracking-[0.25em] text-xs font-bold mt-1">
                        <ShieldCheck size={14} className="text-red" /> Executive Management Console
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 md:p-10 shadow-2xl relative bg-white rounded-3xl border border-white/20">
                    <div className="w-14 h-14 bg-red/10 rounded-2xl flex items-center justify-center text-red mb-6 mx-auto shadow-inner">
                        <KeyRound size={26} />
                    </div>

                    <h2 className="font-serif font-black text-2xl text-dark text-center mb-2">
                        Admin Authentication
                    </h2>
                    <p className="text-xs text-muted text-center mb-6 font-sans">
                        Please insert your Admin ID and password to access dashboard.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-sans text-[11px] font-black text-brown mb-1.5 uppercase tracking-wider">
                                Admin ID / Email
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                className="input-field bg-cream text-sm font-medium"
                                placeholder="e.g. admin@drizzle.com"
                            />
                        </div>

                        <div>
                            <label className="block font-sans text-[11px] font-black text-brown mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field bg-cream text-sm font-medium"
                                placeholder="Enter admin password"
                            />
                        </div>

                        {/* Hint Info Box */}
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900">
                            <Info size={16} className="shrink-0 text-amber-700 mt-0.5" />
                            <div>
                                <p className="font-bold">Required Admin Credentials:</p>
                                <p className="font-mono text-[11px] text-amber-800">Admin ID: <span className="font-bold">admin@drizzle.com</span></p>
                                <p className="font-mono text-[11px] text-amber-800">Password: <span className="font-bold">Admin@123</span></p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full py-4 mt-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-red/25 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} /> Verifying Credentials...
                                </>
                            ) : (
                                <>
                                    Authorize & Enter Dashboard <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <Link to="/" className="text-xs font-bold text-muted hover:text-red transition-colors">
                            &larr; Return to main dining site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
