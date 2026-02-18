# Canadian Payer GLP-1 Budget Impact Model

Welcome to the **Canadian Payer GLP-1 Budget Impact Model**! 

This project is a high-performance web application designed to help Canadian insurance plan managers understand the financial implications of covering GLP-1 medications (like Ozempic or Wegovy) for their member populations.

---

## 🧐 The Problem
GLP-1 agonists are revolutionary drugs for weight loss and diabetes, but they are expensive. Insurance payers in Canada face a difficult challenge:

*   **High Cost**: These drugs can cost over $4,500/year per patient.
*   **High Demand**: A large percentage of the population is eligible (BMI > 30).
*   **Complex Math**: It's hard to balance the *upfront drug costs* against the *long-term medical savings* (e.g., fewer heart attacks and strokes).

**Payers need a tool** to simulate these costs in real-time to make informed coverage decisions.

---

## 💡 The Solution
We built a **Budget Impact Analysis (BIA) Dashboard** that models these costs over a 5-year horizon.

Instead of static spreadsheets, this is a **dynamic, interactive application**. It allows users to:
1.  **Input their Plan Size**: Simulate for a small company (10k lives) or a province (5M lives).
2.  **Adjust Prices**: Change drug costs and negotiated rebates on the fly.
3.  **Visualize Impact**: See exactly how much it will cost (Net Budget Impact) and how many cardiovascular events (heart attacks/strokes) might be avoided.

### How it works:
*   **Real Data**: We use **NHANES** (National Health and Nutrition Examination Survey) data to create a realistic "virtual population" with real BMI, Age, and Diabetes status.
*   **Real Math**: We apply standard health economic formulas (CIHI guidelines) to calculate eligible patients, uptake rates, and medical offsets.
*   **Real-Time**: The dashboard updates instantly as you slide the controls.

---

## 🛠️ Tech Stack
We used a modern, "production-grade" stack to ensure the app is fast, beautiful, and maintainable.

*   **Frontend**: [Next.js 14](https://nextjs.org/) (React) - For a blazing fast, interactive UI.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type-safe, robust code.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) - For a premium, "Apple-like" aesthetic.
*   **Data Visualization**: [Recharts](https://recharts.org/) - For beautiful, responsive charts.
*   **Data Processing**: [Python](https://www.python.org/) & [Pandas](https://pandas.pydata.org/) - Used to process the raw NHANES SAS datasets into clean JSON for the app.
*   **Testing**: [Jest](https://jestjs.io/) - For unit testing the complex economic logic.

---

## 🚀 Getting Started

Want to run this locally? Follow these simple steps:

### 1. Prerequisites
*   Node.js (v18 or higher)
*   Python 3.9+ (only if you want to regenerate data)

### 2. Installation
Clone the repo and install the dependencies:
```bash
git clone https://github.com/your-username/canadian-payer-glp1-model.git
cd canadian-payer-glp1-model
npm install
```

### 3. Run the App
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## � Key Features
*   **Parametric Sensitivity Analysis**: Real-time sliders for sensitive variables.
*   **Canadian Context**: Pre-loaded with standard Canadian assumptions (e.g., $25k cost for Acute MI).
*   **Validation**: Validation logic ensures inputs remain within realistic bounds.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
