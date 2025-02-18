import Transaction from "@/models/transactionModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(res: NextResponse) {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) throw new Error("MongoDB URI is missing");
      await mongoose.connect(process.env.MONGODB_URI);
    }
    const transactions = await Transaction.find();
    const total = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    const credit = transactions
      .filter((t) => t.type == "credit")
      .reduce((acc, transaction) => acc + transaction.amount, 0);
    const debit = transactions
      .filter((t) => t.type == "debit")
      .reduce((acc, transaction) => acc + transaction.amount, 0);

    const recentTransactions = transactions
      .sort((a, b) => b.date - a.date)
      .slice(0, 6);

    const categoryBreakdown = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

    const highestSpendingCategory = Object.keys(categoryBreakdown).reduce(
      (a, b) => (categoryBreakdown[a] > categoryBreakdown[b] ? a : b)
    );

    const lowestSpendingCategory = Object.keys(categoryBreakdown).reduce(
      (a, b) => (categoryBreakdown[a] < categoryBreakdown[b] ? a : b)
    );

    const averageTransactionAmount = (total / transactions.length).toFixed(2);

    const budget = {
      credit: 5000,
      debit: 3000,
    };

    const budgetVsActual = {
      credit: {
        budget: budget.credit,
        actual: credit,
      },
      debit: {
        budget: budget.debit,
        actual: debit,
      },
    };

    return NextResponse.json(
      {
        total,
        credit,
        debit,
        recentTransactions,
        categoryBreakdown,
        highestSpendingCategory,
        lowestSpendingCategory,
        averageTransactionAmount,
        budgetVsActual,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
