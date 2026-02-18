import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function MethodologyModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">How this works</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Budget Impact Methodology</DialogTitle>
                    <DialogDescription>
                        Understanding the "Net Budget Impact" calculation logic.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-medium text-primary">1. Gross Cost</h4>
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md font-mono">
                            (Patients * Uptake) * (Drug Cost * (1 - Rebate)) * Adherence
                        </div>
                        <p className="text-sm text-muted-foreground">
                            We calculate the total cost of the drug for the eligible population, accounting for the negotiated rebate and real-world adherence (45%).
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="font-medium text-emerald-600 dark:text-emerald-400">2. Medical Offsets (Savings)</h4>
                        <div className="text-sm text-muted-foreground p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md font-mono border border-emerald-100 dark:border-emerald-800">
                            Treated Patients * Baseline Risk * 20% Reduction * Cost of Event
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Patients with BMI &gt; 30 who take the drug are assumed to have a 20% lower risk of cardiovascular events (e.g., heart attacks), saving the plan $25,000 per avoided event.
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="font-medium text-blue-600 dark:text-blue-400">3. Net Budget Impact</h4>
                        <div className="text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md font-mono border border-blue-100 dark:border-blue-800">
                            Gross Cost - Medical Offsets
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
