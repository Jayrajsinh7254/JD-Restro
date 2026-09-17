/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: 'var(--cream)',
                cream2: 'var(--cream2)',
                cream3: 'var(--cream3)',
                dark: 'var(--dark)',
                brown: 'var(--brown)',
                red: {
                    DEFAULT: 'var(--red)',
                    hover: 'var(--red-hover)',
                },
                muted: 'var(--muted)',
                border: 'var(--border)',
                cardDark: 'var(--card-dark)',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"DM Sans"', 'sans-serif'],
            },
            boxShadow: {
                card: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                glow: '0 0 40px rgba(192, 57, 43, 0.15)',
            },
        },
    },
    plugins: [],
}
