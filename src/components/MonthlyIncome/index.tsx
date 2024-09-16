import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type Data = {
  id: number;
  amount: number;
  type: number;
  date: string;
  income: number;
};

type Props = {
  data: Data[];
  previousIncome: number;
};

export default function MonthlyIncome({ data, previousIncome }: Props) {
  // Function to calculate the total income for the current month
  const getTotalIncomeCurrentMonth = (): number => {
    const totalIncome = data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.income,
      0
    );
    return totalIncome;
  };

  // Function to calculate the percentage change in income from the previous month
  const getPercentageChange = (): string => {
    if (previousIncome === 0) {
      return "0"; // Avoid division by zero
    }

    const currentIncome = getTotalIncomeCurrentMonth();
    const change = currentIncome - previousIncome;
    const percentageChange = (change / previousIncome) * 100;

    return percentageChange.toFixed(2); // Return percentage as a string
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">
          {getTotalIncomeCurrentMonth().toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-xs font-light md:text-sm">
          {getPercentageChange()}% from the previous month.
        </p>
      </CardFooter>
    </Card>
  );
}
