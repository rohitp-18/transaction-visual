"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITransaction } from "@/models/transactionModel";
import React, { act, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";

export default function Home() {
  const [transactions, setTransactions] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any>();

  useEffect(() => {
    fetch("/api/v1/home")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      });
  }, []);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (transactions) {
      setCategoryBreakdown(
        Object.keys(transactions.categoryBreakdown).map((key) => ({
          name: key,
          value: transactions.categoryBreakdown[key],
          color: getRandomColor(),
        }))
      );
    }
  }, [transactions]);

  return (
    <>
      {transactions && (
        <>
          <section className="max-w-6xl mx-auto p-4">
            <h1 className="text-center py-4">Transaction Visualizer</h1>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 text-base shadow-md rounded-md mb-3">
                <h2 className="text-center opacity-90 font-bold">
                  Total Transactions
                </h2>
                <p className="text-center text-3xl pt-3 pb-2 text-blue-900 font-semibold">
                  ₹{transactions.total}
                </p>
              </div>
              <div className="bg-white p-4 text-base shadow-md rounded-md mb-3">
                <h2 className="text-center opacity-90 font-bold">
                  Total Income
                </h2>
                <p className="text-center text-3xl pt-3 pb-2 text-blue-900 font-semibold">
                  ₹{transactions.credit}
                </p>
              </div>
              <div className="bg-white p-4 text-base shadow-md rounded-md mb-3">
                <h2 className="text-center opacity-90 font-bold">
                  Total Expenses
                </h2>
                <p className="text-center text-3xl pt-3 pb-2 text-blue-900 font-semibold">
                  ₹{transactions.debit}
                </p>
              </div>
              <div className="bg-white px-4 pt-4 pb-1 flex items-center flex-col shadow-md rounded-md mb-3">
                <h2 className="text-center font-bold">Categories Breakdown</h2>
                <PieChart
                  width={300}
                  height={300}
                  className="flex justify-center"
                >
                  <Pie
                    data={
                      categoryBreakdown &&
                      categoryBreakdown.map((key: any) => key)
                    }
                    dataKey="value"
                    cx={150}
                    cy={150}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {categoryBreakdown &&
                      categoryBreakdown.map((key: any) => (
                        <Cell key={`cell-${key.name}`} fill={key.color} />
                      ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div className="bg-white col-span-1 md:col-span-2 p-4 shadow-md rounded-md mb-3">
                <h2 className="text-center font-bold mb-4">
                  Recent Transactions
                </h2>
                <Table className="w-full border-collapse bg-white shadow-md rounded-lg">
                  <TableHeader>
                    <TableRow className="bg-gray-200">
                      <TableHead className="border p-3 text-left">ID</TableHead>

                      <TableHead className="border p-3 text-left">
                        Name
                      </TableHead>

                      <TableHead className="border p-3 text-left">
                        Amount
                      </TableHead>

                      <TableHead className="border p-3 text-left">
                        Date
                      </TableHead>
                      <TableHead className="border p-3 text-left">
                        Category
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!transactions.recentTransactions ||
                      (transactions.recentTransactions.length === 0 && (
                        <TableRow className="h-32 opacity-80">
                          <TableCell colSpan={5} className="text-center">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      ))}

                    {transactions.recentTransactions.map(
                      (transaction: ITransaction) => (
                        <TableRow
                          key={transaction._id}
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          <TableCell className="border p-3">
                            {transaction._id}
                          </TableCell>
                          <TableCell className="border p-3">
                            {transaction.name}
                          </TableCell>
                          <TableCell
                            className={`border p-3 ${
                              transaction.type === "credit"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {transaction.amount}
                          </TableCell>
                          <TableCell className="border p-3">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>

                          <TableCell className="border p-3">
                            {transaction.category}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="bg-white p-4 shadow-md rounded-md">
                <h2 className="text-center font-bold">Predefined Categories</h2>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="bg-white p-1">
                    <p className="text-center">Salary</p>
                  </div>
                  <div className="bg-white p-1">
                    <p className="text-center">Food</p>
                  </div>
                  <div className="bg-white p-1">
                    <p className="text-center">Transport</p>
                  </div>
                  <div className="bg-white p-1">
                    <p className="text-center">Entertainment</p>
                  </div>
                  <div className="bg-white p-1">
                    <p className="text-center">Utilities</p>
                  </div>
                  <div className="bg-white p-1">
                    <p className="text-center">Healthcare</p>
                  </div>
                  <div className="bg-white p-1">
                    <p className="text-center">Others</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 shadow-md rounded-md mb-3">
                <h2 className="text-center font-bold">Spending Insights</h2>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="bg-white p-2">
                    <p className="text-center">
                      Highest Spending Category:{" "}
                      <b>{transactions.highestSpendingCategory}</b>
                    </p>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-center">
                      Lowest Spending Category:{" "}
                      <b>{transactions.lowestSpendingCategory}</b>
                    </p>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-center">
                      Average Transaction Amount:{" "}
                      <b>₹{transactions.averageTransactionAmount}</b>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 shadow-md rounded-md mb-3">
                <h2 className="text-center font-bold mb-3">Budget vs Actual</h2>
                <BarChart
                  width={300}
                  height={300}
                  data={[
                    {
                      name: "credit",
                      budget: transactions.budgetVsActual.credit.budget,
                      actual: transactions.budgetVsActual.credit.actual,
                    },
                    {
                      name: "debit",
                      budget: transactions.budgetVsActual.debit.budget,
                      actual: transactions.budgetVsActual.debit.actual,
                    },
                  ]}
                  className="mx-auto"
                >
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar width={10} dataKey="budget" fill="#8884d8" />
                  <Bar width={10} dataKey="actual" fill="#82ca9d" />
                </BarChart>
              </div>
              <div className="bg-white p-4 shadow-md rounded-md mb-3">
                <h2 className="text-center font-bold">Budget</h2>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="bg-white p-2">
                    <p className="text-center">
                      Income:{" "}
                      <b>₹{transactions.budgetVsActual.credit.budget}</b>
                    </p>
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-center">
                      Expense:{" "}
                      <b>₹{transactions.budgetVsActual.debit.budget}</b>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </>
      )}
    </>
  );
}
