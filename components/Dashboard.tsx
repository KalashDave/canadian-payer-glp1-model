"use client"

import { useState, useEffect, useMemo } from "react"
import { BudgetModel, SimulationInputs, SimulationResult, CONSTANTS, Member } from "@/lib/BudgetModel"
import { ImpactChart } from "@/components/ImpactChart"
import { MethodologyModal } from "@/components/MethodologyModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, TrendingUp, DollarSign, Users } from "lucide-react"
import populationRaw from "@/data/nhanes_processed.json"

// Type assertion for the imported JSON
const populationData = populationRaw as Member[];

export function Dashboard() {
    // State for inputs
    const [inputs, setInputs] = useState<SimulationInputs>({
        target_population_size: 1000000,
        drug_annual_cost: 4500, // CIHI default
        rebate_percent: 25,     // Typical negotiation
        uptake_rate: [0.02, 0.05, 0.10, 0.15, 0.20] // 5-year ramp
    });

    // State for results
    const [results, setResults] = useState<SimulationResult[]>([]);

    // Calculate generic results on input change
    useEffect(() => {
        try {
            const data = BudgetModel.runProjection(inputs, populationData);
            setResults(data);
        } catch (error) {
            console.error("Calculation error:", error);
        }
    }, [inputs]);

    // Derived metrics for Top Level KPIs (Year 5 snapshot or Cumulative)
    const cumulativeImpact = useMemo(() => {
        if (results.length === 0) return 0;
        return results.reduce((sum, r) => sum + r.net_budget_impact, 0);
    }, [results]);

    const year5PMPM = useMemo(() => {
        if (results.length === 0) return 0;
        const y5 = results[4]; // Year 5
        // PMPM = Net Impact / Members / 12
        return y5.net_budget_impact / inputs.target_population_size / 12;
    }, [results, inputs.target_population_size]);

    const totalEventsAvoided = useMemo(() => {
        return results.reduce((sum, r) => sum + r.cv_events_avoided, 0);
    }, [results]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">

            {/* Sidebar Controls */}
            <Card className="col-span-1 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <CardHeader>
                    <CardTitle className="text-lg flex justify-between items-center">
                        Model Inputs
                        <MethodologyModal />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* Plan Size */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2">
                                Plan Size
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
                                        <TooltipContent>Total number of covered lives in the insurance plan.</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <span className="text-sm font-mono text-muted-foreground">
                                {(inputs.target_population_size / 1000).toFixed(0)}k
                            </span>
                        </div>
                        <Slider
                            value={[inputs.target_population_size]}
                            min={10000} max={5000000} step={10000}
                            onValueChange={(val) => setInputs(prev => ({ ...prev, target_population_size: val[0] }))}
                        />
                    </div>

                    {/* Annual Drug Cost */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2">
                                Annual Cost (CAD)
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
                                        <TooltipContent>List price of the drug per patient per year before rebates.</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <span className="text-sm font-mono text-muted-foreground">${inputs.drug_annual_cost}</span>
                        </div>
                        <Slider
                            value={[inputs.drug_annual_cost]}
                            min={1000} max={15000} step={100}
                            onValueChange={(val) => setInputs(prev => ({ ...prev, drug_annual_cost: val[0] }))}
                        />
                    </div>

                    {/* Rebate % */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2">
                                Rebate %
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><HelpCircle className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
                                        <TooltipContent>Confidential discount negotiated between Payer and Manufacturer.</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <span className="text-sm font-mono text-muted-foreground text-green-600 font-bold">{inputs.rebate_percent}%</span>
                        </div>
                        <Slider
                            value={[inputs.rebate_percent]}
                            min={0} max={60} step={1}
                            className="[&>.bg-primary]:bg-green-600"
                            onValueChange={(val) => setInputs(prev => ({ ...prev, rebate_percent: val[0] }))}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Hardcoded Assumptions (CIHI)</Label>
                        <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Adherence Rate:</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="font-mono text-foreground border-b border-dashed border-gray-400">45%</TooltipTrigger>
                                        <TooltipContent>Real-world adherence drop-off observed in claims data.</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="flex justify-between">
                                <span>Acute MI Cost:</span>
                                <span className="font-mono text-foreground">$25,000</span>
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-3 space-y-6">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">5-Year Net Impact</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${(cumulativeImpact / 1000000).toFixed(1)}M</div>
                            <p className="text-xs text-muted-foreground">Cumulative over 5 years</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Year 5 PMPM</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">${year5PMPM.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Per Member Per Month (Net)</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Events Avoided</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{totalEventsAvoided.toFixed(0)}</div>
                            <p className="text-xs text-muted-foreground">Acute MI/Stroke prevented (Calc)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="h-[450px]">
                    <ImpactChart data={results} />
                </div>

            </div>
        </div>
    )
}
