/** @type {import('tailwindcss').Config} */
export default {
    content: ["./lib/**/*.{html,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {},
        colors: {
            transparent: "transparent",
            current: "currentColor",
            black: "#101010",
            pink: "#e82070",
            blue: "#0078c8",
            white: "#ffffff",
        },
    },
    plugins: [],
};
