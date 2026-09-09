/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/containers/**/*.{js,jsx,ts,tsx}",
    "./src/lib/**/*.{js,jsx,ts,tsx}",
    "./src/config/**/*.{js,jsx,ts,tsx}",
    "./src/services/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Enhanced mobile-first breakpoints
      screens: {
        "xs": "375px",        // Small phones
        "sm": "640px",        // Large phones / small tablets
        "md": "768px",        // Tablets
        "lg": "1024px",       // Desktop
        "xl": "1280px",       // Large desktop
        "2xl": "1536px",      // Very large screens
        // Custom NodeMeta breakpoints
        "mobile": "480px",
        "tablet": "768px", 
        "desktop": "1024px",
        "wide": "1440px",
        "ultrawide": "1920px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#1cac1d",
          dark: "#158a18",
          light: "#3bd63e",
        },
        neutral: {
          DEFAULT: "#f8f9f9",
          50: "#fafafa",
          100: "#f2f2f2",
          200: "#e8e8e8",
          300: "#d4d4d4",
        },
        nodemeta: {
          teal: "#2dd4bf",
          cyan: "#22d3ee",
          green: "#1cac1d",
          lime: "#84cc16",
          dark: "#0a0a0a",
          // Extended color palette for better mobile experience
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0", 
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        // Mobile-specific spacing
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        pill: "25px",
        '4xl': '2rem',
      },
      boxShadow: {
        card: "0 2px 16px rgb(53 69 89 / 5%)",
        header: "0 4px 14px 0 rgb(0 0 0 / 10%)",
        // Mobile-optimized shadows
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(34, 211, 238, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      backgroundImage: {
        "nodemeta-gradient":
          "linear-gradient(180deg, #22d3ee 0%, #2dd4bf 50%, #84cc16 100%)",
        // Mobile-optimized gradients
        "mobile-hero": "linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%)",
        "mobile-card": "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      backdropBlur: {
        'xs': '2px',
        'mobile': '8px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
    ...(process.env.NODE_ENV === "development"
      ? [require("tailwindcss-debug-screens")]
      : []),
  ],
  // Mobile-first responsive design
  variants: {
    extend: {
      // Enable hover variants only on devices that support hover
      backgroundColor: ['hover', 'focus'],
      borderColor: ['hover', 'focus'],
      textColor: ['hover', 'focus'],
      scale: ['hover', 'focus', 'active'],
      rotate: ['hover', 'focus', 'group-hover'],
    },
  },
};
