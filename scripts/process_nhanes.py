import pandas as pd
import json
import numpy as np

# File paths (expected)
# File paths (expected)
DEMO_PATH = "data/DEMO_H.xpt"
DIET_PATH = "data/BMX_H.xpt"
LABS_PATH = "data/GHB_H.xpt"
OUTPUT_PATH = "data/nhanes_processed.json"

def process_nhanes():
    try:
        # 1. Load Data
        print("Loading NHANES XPTs...")
        demo_df = pd.read_sas(DEMO_PATH)
        exam_df = pd.read_sas(DIET_PATH)
        labs_df = pd.read_sas(LABS_PATH)

        # 2. Merge on SEQN
        print("Merging datasets...")
        merged_df = demo_df.merge(exam_df, on="SEQN", how="inner").merge(labs_df, on="SEQN", how="inner")

        # 3. Clean & Calculate
        # BMI Calculation: WTMEC2YR is weight, but usually BMI is direct in exam file (BMXBMI)
        # Using BMXBMI if available, else calc
        if 'BMXBMI' in merged_df.columns:
            merged_df['bmi'] = merged_df['BMXBMI']
        else:
             # Fallback logic if raw fields exist
            pass
        
        # Diabetes Flag: Glycohemoglobin (LBXGH) > 6.5%
        # LBXGH is often the column name in NHANES
        merged_df['has_diabetes'] = merged_df['LBXGH'] > 6.5
        
        # 4. Standardize Columns for App
        # Schema: { id, age, sex, bmi, has_diabetes, risk_score }
        final_df = merged_df[['SEQN', 'RIDAGEYR', 'RIAGENDR', 'bmi', 'has_diabetes']].copy()
        final_df.columns = ['id', 'age', 'sex', 'bmi', 'has_diabetes']
        
        # Fill NaN
        final_df = final_df.dropna(subset=['bmi'])
        
        # Calculate Risk Score (Simple Proxy)
        # Risk increases with Age, BMI, Diabetes
        final_df['risk_score'] = (final_df['age'] * 0.1) + (final_df['bmi'] * 0.2) + (final_df['has_diabetes'].astype(int) * 5)

        # 5. Export
        print(f"Exporting {len(final_df)} records to JSON...")
        final_df.to_json(OUTPUT_PATH, orient='records')
        print("Done.")

    except Exception as e:
        print(f"Error processing NHANES: {e}")

if __name__ == "__main__":
    process_nhanes()
