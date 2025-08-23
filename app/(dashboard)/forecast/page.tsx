// app/(dashboard)/forecast/page.tsx
"use client";

import { AmountInput } from "@/components/amount-input";
import { DataCard } from "@/components/data-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FaPiggyBank } from "react-icons/fa";

const ForecastPage = () => {
  // récupération du solde restant via l’API existante
  const { data, isLoading } = useGetSummary();

  // états locaux pour les champs de simulation
  const [months, setMonths] = useState("");
  const [growthRate, setGrowthRate] = useState("");
  const [investment, setInvestment] = useState("");
  const [results, setResults] = useState<{ month: number; value: number }[]>(
    []
  );

  // fonction appelée au clic sur "Calculate"
  const handleCalculate = () => {
    const m = parseInt(months, 10);
    const g = parseFloat(growthRate) / 100;
    const inv = parseFloat(investment || "0");
    const initial = data?.remainingAmount ?? 0;

    const newResults: { month: number; value: number }[] = [];
    let current = initial;
    for (let i = 1; i <= m; i++) {
      current = current * (1 + g) - inv;
      newResults.push({ month: i, value: current });
    }
    setResults(newResults);
  };

  // affichage d’un skeleton pendant le chargement du résumé
  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Cash Forecast</CardTitle>
          <CardDescription>
            Simulez l’évolution de votre trésorerie en fonction d’un taux de
            croissance mensuel et d’un investissement récurrent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulaire de saisie */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* solde initial (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trésorerie initiale</label>
              <Input
                disabled
                value={formatCurrency(data?.remainingAmount ?? 0)}
                className="disabled:opacity-100"
              />
            </div>
            {/* nombre de mois */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de mois</label>
              <Input
                type="number"
                min="1"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                placeholder="ex : 12"
              />
            </div>
            {/* taux de croissance mensuel en % */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Taux de croissance (%) / mois
              </label>
              <Input
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                placeholder="ex : 2"
              />
            </div>
            {/* investissement mensuel */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Investissement mensuel
              </label>
              <AmountInput
                value={investment}
                onChange={(val) => setInvestment(val ?? "")}
                placeholder="ex : 100"
              />
            </div>
          </div>
          {/* bouton de calcul */}
          <Button
            disabled={!months || !growthRate}
            onClick={handleCalculate}
            className="w-full lg:w-auto"
          >
            Calculate
          </Button>

          {/* Résultats : carte synthétique + tableau détaillé */}
          {results.length > 0 && (
            <>
              <DataCard
                icon={FaPiggyBank}
                title="Trésorerie finale"
                value={results[results.length - 1].value}
                dateRange={`Après ${months} mois`}
                percentageChange={0}
              />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mois</TableHead>
                      <TableHead>Prévision</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{formatCurrency(item.value)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastPage;
