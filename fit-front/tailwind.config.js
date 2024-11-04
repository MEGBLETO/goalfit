import flowbite from 'flowbite-react/tailwind'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        flowbite.content(),
    ],
    theme: {
        extend: {
            colors: {
                cyan: colors.blue,
            },
        },
    },
    plugins: [flowbite.plugin()],
}
