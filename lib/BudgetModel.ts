export interface Member {
    id: number;
    age: number;
    sex: number; // 1=Male, 2=Female
    bmi: number;
    has_diabetes: boolean;
}

export interface SimulationInputs {
    target_population_size: number;
    drug_annual_cost: number;
    rebate_percent: number; // 0-100
    uptake_rate: number[]; // Array of 5 years (e.g. [0.02, 0.05...])
}

export interface SimulationResult {
    year: number;
    gross_cost: number;
    medical_offsets: number;
    net_budget_impact: number;
    cumulative_uptake: number;
    eligible_patients: number;
    treated_patients: number;
    cv_events_avoided: number;
}

// CIHI 2024 / Standard Cdn Payer Params
export const CONSTANTS = {
    ACUTE_MI_COST: 25000,
    ADHERENCE_RATE: 0.45,
    CV_RISK_REDUCTION: 0.20, // 20% relative risk reduction (RRR)
    BASELINE_CV_RISK_HIGH_BMI: 0.08, // 8% annual risk for high BMI + comorbidities
};

export class BudgetModel {
    /**
     * Run the 5-year budget impact analysis.
     */
    static runProjection(inputs: SimulationInputs, populationSample: Member[]): SimulationResult[] {
        this.validateInputs(inputs);

        const results: SimulationResult[] = [];
        const SCALING_FACTOR = inputs.target_population_size / populationSample.length;

        // Identify Eligible Cohort (BMI > 30 OR (BMI > 27 + Diabetes))
        // Health Canada indication logic approx.
        const eligibleMembers = populationSample.filter(
            (m) => m.bmi >= 30 || (m.bmi >= 27 && m.has_diabetes)
        );

        // Effective Eligible Count in Target Population
        const totalEligibleInPlan = eligibleMembers.length * SCALING_FACTOR;

        for (let year = 1; year <= 5; year++) {
            const uptake = inputs.uptake_rate[year - 1] || 0;
            const treatedCount = totalEligibleInPlan * uptake;

            // 1. Drug Cost Calculation
            // Net Price = List * (1 - Rebate)
            const netDrugPrice = inputs.drug_annual_cost * (1 - inputs.rebate_percent / 100);

            // Real-World Cost = Treated * Price * Adherence
            // Note: Some models assume full cost for adherence, but typically payers pay for filled scripts.
            // We assume cost incurred is proportional to adherence for simplicity, or 
            // better: standard adherence means they stop taking it. 
            // User prompt says: "Gross Cost = Cohort Size * Uptake% * Drug Cost" 
            // but also "Adherence Rate: 45% (Real-world drop-off)". 
            // If drop-off means they stop paying, then cost is reduced.
            // Let's apply Adherence to the *Cost* incurred.
            const grossCost = treatedCount * netDrugPrice * CONSTANTS.ADHERENCE_RATE;

            // 2. Medical Offsets (Savings)
            // Logic: If BMI>30 & On Drug -> Reduce "CV Event Risk" by 20%
            // Calculation: Treated * BaselineRisk * RRR * CostOfEvent * Adherence
            // (Only adherent patients get the benefit)
            const cvEventsAvoided = treatedCount * CONSTANTS.BASELINE_CV_RISK_HIGH_BMI * CONSTANTS.CV_RISK_REDUCTION * CONSTANTS.ADHERENCE_RATE;
            const medicalOffsets = cvEventsAvoided * CONSTANTS.ACUTE_MI_COST;

            // 3. Net Impact
            const netImpact = grossCost - medicalOffsets;

            results.push({
                year,
                gross_cost: grossCost,
                medical_offsets: medicalOffsets,
                net_budget_impact: netImpact,
                cumulative_uptake: uptake,
                eligible_patients: totalEligibleInPlan,
                treated_patients: treatedCount,
                cv_events_avoided: cvEventsAvoided
            });
        }

        return results;
    }

    static validateInputs(inputs: SimulationInputs) {
        if (inputs.target_population_size < 0) throw new Error("Population size must be positive");
        if (inputs.drug_annual_cost < 0) throw new Error("Cost cannot be negative");
        if (inputs.rebate_percent < 0 || inputs.rebate_percent > 100) throw new Error("Rebate must be 0-100%");
        if (inputs.uptake_rate.length !== 5) throw new Error("Uptake must be defined for 5 years");
    }
}
