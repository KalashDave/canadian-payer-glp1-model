import { BudgetModel, CONSTANTS } from "@/lib/BudgetModel";

describe("BudgetModel", () => {
    const mockPopulation = [
        { id: 1, age: 50, sex: 1, bmi: 32, has_diabetes: false },
        { id: 2, age: 40, sex: 2, bmi: 25, has_diabetes: false },
        { id: 3, age: 60, sex: 1, bmi: 28, has_diabetes: true },
        { id: 4, age: 30, sex: 2, bmi: 22, has_diabetes: false },
    ];

    const defaultInputs = {
        target_population_size: 1000,
        drug_annual_cost: 4500,
        rebate_percent: 25,
        uptake_rate: [0.1, 0.1, 0.1, 0.1, 0.1],
    };

    it("should calculate correct eligible population", () => {
        // ID 1 (BMI 32) -> Eligible
        // ID 3 (BMI 28 + Diabetes) -> Eligible
        // Eligible count in sample = 2
        // Scaling factor = 1000 / 4 = 250
        // Total Eligible = 2 * 250 = 500
        const results = BudgetModel.runProjection(defaultInputs, mockPopulation);
        expect(results[0].eligible_patients).toBe(500);
    });

    it("should apply rebate correctly to gross cost", () => {
        // Year 1: Uptake 10% = 50 treated
        // Net Cost = 4500 * (1 - 0.25) = 3375
        // Adherence = 0.45
        // Gross Cost = 50 * 3375 * 0.45 = 75937.5
        const results = BudgetModel.runProjection(defaultInputs, mockPopulation);
        expect(results[0].gross_cost).toBeCloseTo(75937.5);
    });

    it("should calculate zero cost for zero uptake", () => {
        const inputs = { ...defaultInputs, uptake_rate: [0, 0, 0, 0, 0] };
        const results = BudgetModel.runProjection(inputs, mockPopulation);
        expect(results[0].net_budget_impact).toBe(0);
    });

    it("should throw error for invalid inputs", () => {
        expect(() => {
            BudgetModel.validateInputs({ ...defaultInputs, rebate_percent: 110 });
        }).toThrow();
    });
});
