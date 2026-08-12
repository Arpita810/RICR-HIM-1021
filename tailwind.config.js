/** @type {import('tailwindcss').Config} */
export default {
      content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
            extend: {
                  fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                  },
                  colors: {
                        primary: {
                              50: '#eff6ff',
                              100: '#dbeafe',
                              200: '#bfdbfe',
                              300: '#93c5fd',
                              400: '#60a5fa',
                              500: '#3b82f6',
                              600: '#2563eb',
                              700: '#1d4ed8',
                              800: '#1e40af',
                              900: '#1e3a8a',
                        },
                        accent: {
                              400: '#a78bfa',
                              500: '#8b5cf6',
                              600: '#7c3aed',
                        }
                  },
                  animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'float-delayed': 'float 6s ease-in-out 2s infinite',
                        'float-slow': 'float 8s ease-in-out 1s infinite',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'spin-slow': 'spin 20s linear infinite',
                        'gradient': 'gradient 8s ease infinite',
                        'counter': 'counter 2s ease-out forwards',
                  },
                  keyframes: {
                        float: {
                              '0%, 100%': { transform: 'translateY(0px)' },
                              '50%': { transform: 'translateY(-20px)' },
                        },
                        gradient: {
                              '0%, 100%': { backgroundPosition: '0% 50%' },
                              '50%': { backgroundPosition: '100% 50%' },
                        },
                  },
                  backgroundSize: {
                        '300%': '300%',
                  },
            },
      },
      plugins: [],
}
