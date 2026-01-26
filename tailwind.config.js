/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./constants.ts",
    ],
    theme: {
        extend: {
            borderRadius: {
                'none': '0',
                'sm': '10px',
                'DEFAULT': '10px',
                'md': '10px',
                'lg': '10px',
                'xl': '10px',
                '2xl': '10px',
                '3xl': '10px',
                'full': '10px',
            }
        },
    },
    plugins: [],
}
