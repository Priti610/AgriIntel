# Prima-AgriIntel 🌾
### Agricultural Market Intelligence & Smart Dispatch Optimization for Indian Farmers

**"Sell Smarter. Earn Better. Farm Stronger."**

Prima-AgriIntel helps Indian farmers compare agricultural mandi prices, calculate realistic road transportation and handling expenses, and identify the market that may provide the highest net return in their hands after freight deductions.

---

## 🌟 Key Features

1. **Dynamic Indian Crop Selection**:
   - Supports 20+ prominent Indian crops across Cereals, Pulses, Oilseeds, Vegetables, Fruits, Commercial crops, and Spices.
   - Categorized with Hindi names, perishability ratings, and reference modal prices.

2. **Connected State → District → Mandi Directory**:
   - Verified APMC mandis in Maharashtra (Nashik, Pune, Ahmednagar, Solapur, Nagpur, Kolhapur, Jalgaon, etc.) and key inter-state terminals (Kolar APMC, Azadpur Mandi).
   - Multi-mandi selection with the ability to add and compare mandis from neighboring districts.

3. **Transparent Net Revenue Calculation Engine**:
   - Gross Revenue = Expected Selling Price × Produce Quantity.
   - Road Transit Freight = Road Distance × Vehicle Rate per km × Trips Required.
   - Mandi Handling Cess = Porterage, weighbridge fees, and APMC market charges.
   - Distance-based transit spoilage degradation for perishable crops (e.g. tomatoes, onions, grapes).
   - **Estimated Net Revenue** = Gross Revenue − Transport Cost − Handling Cost − Spoilage Loss.

4. **AI-Assisted Best Mandi Recommendation (Gemini API + Deterministic Fallback)**:
   - Identifies the highest net return mandi and calculates the net advantage over the runner-up.
   - Explicitly explains economic trade-offs (e.g., when a higher headline price at Mandi B is eaten up by long-haul freight compared to Mandi A).
   - Works 100% offline and on static GitHub Pages with a robust deterministic mathematical fallback.

5. **Visual Comparison & Interactive Analytics**:
   - Ranked comparison table with sortable columns and Indian Rupee (`₹`) formatting.
   - Recharts visual bar charts comparing net return vs. freight drag.
   - Route transport trip planner & vehicle capacity calculators.

6. **Two-Level Experience**:
   - **Guest Users**: Instant access to comparison desk, transport calculator, and basic recommendations.
   - **Registered / Demo Mode Users**: Unlocks 3–7 day price and arrival signals, travel transit weather, and saved market journeys.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/prima-agriintel.git
cd prima-agriintel

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 📦 Building for Production

```bash
# Build the production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 GitHub Pages Deployment Guide

This project is built to deploy seamlessly to **GitHub Pages** as a static single-page application.

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Prima-AgriIntel"
   git branch -M main
   git remote add origin https://github.com/<your-username>/prima-agriintel.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - The included `.github/workflows/deploy.yml` workflow will automatically build and publish your site!

---

## 🤖 AI Integration & Security Note

- **GitHub Pages Safe**: The static frontend hosted on GitHub Pages does not expose or embed any private API keys.
- **Server-Side Architecture**: When deployed in a full-stack environment (Node/Express), Gemini API calls are securely proxied through `/api/recommendation` using `@google/genai`.
- **Deterministic Math Engine**: If the Gemini API is unreachable, the application automatically computes identical rankings, net differences, and trade-off explanations via ordinary JavaScript logic.

---

## 📄 License & Disclaimer

- Data displayed in Demo Mode is based on Agmarknet APMC bulletin formats and is clearly badged.
- Built for Indian farmers, agricultural cooperatives, and APMC market stakeholders.
