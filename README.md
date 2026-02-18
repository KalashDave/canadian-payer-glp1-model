# Canadian Payer GLP-1 Budget Impact Model

A production-grade "Real-World Evidence" (RWE) application allowing Canadian Insurance Plan Managers to estimate the financial impact of covering GLP-1 medications.

## 🌟 Key Features
- **Real-Time BIA Modeling**: 5-Year forecast of Gross Costs, Medical Offsets, and Net Impact.
- **Educational First UI**: "Apple-style" aesthetics with shadcn/ui, featuring "Contextual Learning" tooltips.
- **Parametric Sensitivity Analysis**: Real-time sliders for Drug Price, Rebates, and Population Size.
- **Canadian Parameters**: Pre-loaded with CIHI 2024 cost assumptions ($25k Acute MI, $4.5k Annual Drug Cost).

## 🏗️ System Architecture

```mermaid
graph TD
    A[NHANES Data (CSV)] -->|scripts/process_nhanes.py| B(Cleaned JSON)
    B -->|Import| C[Next.js App Router]
    C -->|Hydrate| D[BudgetModel.ts]
    D -->|Calculate| E[Dashboard State]
    E -->|Render| F[Recharts Visualization]
    G[User Input] -->|Update| E
```

## 🚀 How to Run

> **Note**: This project requires Node.js (v18+) and Python 3.9+.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Generate Data** (Optional - Sample included):
    ```bash
    # Requires pandas
    python scripts/process_nhanes.py
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## 🧪 Testing

Run the Jest unit test suite to verify the HEOR math logic:
```bash
npm test
```

## 📚 Logic Overview
The model uses a standard Budget Impact Analysis (BIA) formula:
1.  **Eligible Population**: Filtered by BMI > 30 (or >27 + Diabetes).
2.  **Uptake**: 2% -> 20% ramp over 5 years.
3.  **Gross Cost**: `(Eligible * Uptake) * (Cost * (1-Rebate)) * Adherence (45%)`.
4.  **Offsets**: CV Risk Reduction (20%) for adherent patients.
