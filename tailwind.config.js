/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Exact Preskool Color Palette
                'brand-blue': '#3D5EE1',
                'brand-orange': '#FF9B44',
                'brand-purple': '#6E62E5',
                'bg-main': '#F7F7FA',
                'card-white': '#FFFFFF',
                'text-main': '#333333',
                'text-muted': '#888888',
                'success-light': '#E1F3E9',
                'danger-light': '#FFF0F0',
                'dark-navy': '#1E293B',
            },
            boxShadow: {
                'card': '0 4px 24px 0 rgba(62, 44, 90, 0.05)',
                'sidebar': '0 0 10px rgba(0, 0, 0, 0.1)',
            },
            borderRadius: {
                'card': '10px',
                'banner': '15px',
            },
            fontFamily: {
                'poppins': ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
