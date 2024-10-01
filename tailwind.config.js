/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    borderWidth: {
      DEFAULT: "2px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sy: {
          DEFAULT: "hsl(var(--sy-base-12))",
          "01": "hsl(var(--sy-base-01))",
          "02": "hsl(var(--sy-base-02))",
          "03": "hsl(var(--sy-base-03))",
          "04": "hsl(var(--sy-base-04))",
          "05": "hsl(var(--sy-base-05))",
          "06": "hsl(var(--sy-base-06))",
          "07": "hsl(var(--sy-base-07))",
          "08": "hsl(var(--sy-base-08))",
          "09": "hsl(var(--sy-base-09))",
          10: "hsl(var(--sy-base-10))",
          11: "hsl(var(--sy-base-11))",
          12: "hsl(var(--sy-base-12))",
          13: "hsl(var(--sy-base-13))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        silkscreen: [
          "Silkscreen",
          "system-ui",
          '"Segoe UI"',
          "Helvetica",
          "Arial",
        ],
        firasans: [
          '"Fira Sans"',
          "system-ui",
          '"Segoe UI"',
          "Helvetica",
          "Arial",
        ],
        dosis: [
          "Dosis",
          "system-ui",
          '"Segoe UI"',
          '"Open Sans"',
          "Helvetica",
          "Arial",
        ],
        teko: ["Teko", "system-ui", '"Segoe UI"', "Helvetica", "Arial"],
        pixelify: [
          '"Pixelify Sans"',
          "system-ui",
          '"Segoe UI"',
          "Helvetica",
          "Arial",
        ],
        miniver: ["Miniver", "system-ui", '"Segoe UI"', "Helvetica", "Arial"],
      },
      screens: {
        actionmenu: "800px",
        casenumbers: "980px",
        officers: "1270px",
        civilians: "1560px",
        notes: "1800px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({
      nocompatible: true,
    }),
  ],
};
