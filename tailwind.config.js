module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ['Roboto', 'system-ui', 'sans-serif'],
				serif: ['Georgia', 'serif'],
			},
			colors: {
				'cm-green': '#007a5e',
				'cm-red': '#ce1126',
				'cm-yellow': '#fcd116',
				'healthcare-blue': '#005eb8',
				'healthcare-light-blue': '#99c0de',
				'healthcare-gray': '#f3f6f9',
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "#005eb8",
					foreground: "#ffffff",
				},
				secondary: {
					DEFAULT: "#007a5e",
					foreground: "#ffffff",
				},
				destructive: {
					DEFAULT: "#ce1126",
					foreground: "#ffffff",
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
			backgroundImage: {
				'gradient-bamenda': 'linear-gradient(to right, #007a5e, #fcd116, #ce1126)',
				'gradient-healthcare': 'linear-gradient(to right, #005eb8, #99c0de)',
			},
			boxShadow: {
				'healthcare': '0 4px 20px -2px rgba(0, 94, 184, 0.1)',
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
};