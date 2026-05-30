module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        coal: {
          950: "#05080c",
          900: "#090d12",
          850: "#0d131a",
          800: "#121923"
        },
        signal: {
          amber: "#f6b63f",
          orange: "#f07324",
          cyan: "#16b8d4",
          green: "#1aa66f"
        }
      },
      boxShadow: {
        premium: "0 30px 90px rgba(0, 0, 0, 0.34)",
        lift: "0 24px 70px rgba(16, 31, 45, 0.18)",
        glow: "0 0 46px rgba(240, 115, 36, 0.28)"
      },
      fontFamily: {
        display: ["Space Grotesk", "Manrope", "Arial", "sans-serif"],
        body: ["Manrope", "Arial", "sans-serif"]
      },
      backgroundImage: {
        "industrial-grid":
          "linear-gradient(90deg, rgba(255,255,255,.065) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px)",
        "brand-metal": "linear-gradient(135deg, #f6b63f 0%, #f07324 52%, #16b8d4 140%)"
      }
    }
  },
  plugins: []
};
