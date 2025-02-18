"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ITransaction } from "@/models/transactionModel";
import { useToast } from "@/hooks/use-toast";
import DeleteAlert from "./deleteAlert";
import TransactionUpdate from "./updateTrans";
import { Pen, Trash } from "lucide-react";

const TransactionsPage = () => {
  const [columns, setColumns] = useState([
    "ID",
    "Name",
    "Date",
    "Amount",
    "Description",
    "Type",
    "Category",
    "Actions",
  ]);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
  });
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [transactions, setTransactions] = useState<ITransaction[] | []>([]);
  const [showColumnPopup, setShowColumnPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [updateTransaction, setUpdateTransaction] = useState<any>(null);
  const [deleteTransaction, setDeleteTransaction] = useState<any>(null);

  const { toast } = useToast();

  const toggleColumn = (column: string) => {
    setColumns((prevColumns) =>
      prevColumns.includes(column)
        ? prevColumns.filter((col) => col !== column)
        : [...prevColumns, column]
    );
  };

  const fetchTransactions = async () => {
    try {
      fetch("/api/v1/trans", {
        method: "GET",
      })
        .then((data) => data.json())
        .then((data) => setTransactions(data));
    } catch (error) {
      toast({ title: "Error", description: "Error fetching transactions" });
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredTransactions =
    transactions &&
    transactions.filter((transaction: ITransaction) => {
      if (filters.type === "all" && filters.category === "all") {
        return true;
      }

      if (filters.type === "all") {
        return transaction.category === filters.category;
      }

      if (filters.category === "all") {
        return transaction.type === filters.type;
      }

      return (
        (filters.type ? transaction.type === filters.type : true) &&
        (filters.category ? transaction.category === filters.category : true)
      );
    });

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  useEffect(() => {
    setColumns(
      (prevColumns) =>
        // prevColumns.includes(column)?
        prevColumns.filter((col) => col !== "Type" && col !== "Description")
      // : [...prevColumns, column]
    );
  }, []);

  const handleDeleteTransaction = () => {
    try {
      if (!deleteTransaction) return;
      fetch(`/api/v1/trans/${deleteTransaction._id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          toast({
            title: "Transaction deleted",
            description: "Transaction deleted successfully",
          });
          setSelectedTransaction(null);
          fetchTransactions();
        } else {
          toast({ title: "Error", description: "Error deleting transaction" });
        }
      });
    } catch (error) {
      toast({ title: "Error", description: "Error deleting transaction" });
    }
  };

  function callback(call: any) {
    call(selectedTransaction);
    setSelectedTransaction(null);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      {transactions && (
        <div className="p-5 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Transactions
          </h1>
          <div className="mb-4 flex justify-between items-center">
            <div className="md:flex md:space-x-4 hidden opacity-80">
              {[
                "ID",
                "Name",
                "Date",
                "Amount",
                "Description",
                "Type",
                "Category",
                "Actions",
              ].map((column) => (
                <Label key={column} className="mr-4 flex items-center">
                  <Input
                    type="checkbox"
                    checked={columns.includes(column)}
                    onChange={() => toggleColumn(column)}
                    className="mr-2"
                  />
                  {column}
                </Label>
              ))}
            </div>
            <Button
              className="md:hidden block"
              onClick={() => setShowColumnPopup(true)}
            >
              Columns
            </Button>
            <Button
              onClick={() => setShowFilterPopup(true)}
              className="ml-4 px-4 py-2 bg-white text-black border border-1 border-black rounded"
            >
              Add Filters
            </Button>
          </div>
          {updateTransaction && (
            <TransactionUpdate
              transaction={updateTransaction}
              fetchTransactions={fetchTransactions}
              setOpen={setUpdateTransaction}
            />
          )}
          {selectedTransaction && (
            <Dialog
              open={!!selectedTransaction}
              onOpenChange={() => setSelectedTransaction(null)}
            >
              <DialogContent
                style={{ scrollbarWidth: "thin" }}
                className="md:min-w-96 w-72 max-h-full overflow-auto"
              >
                <DialogHeader>
                  <DialogTitle>Transaction Details</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    ID
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedTransaction._id}
                  </p>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedTransaction.name}
                  </p>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Amount
                  </Label>
                  <p
                    className={`mt-1 ${
                      selectedTransaction.amount < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {selectedTransaction.amount}
                  </p>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Date
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Type
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedTransaction.type}
                  </p>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Category
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedTransaction.category}
                  </p>
                </div>
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <p className="mt-1 text-gray-900">
                    {selectedTransaction.description}
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setSelectedTransaction(null)}
                    className="px-4 py-2 rounded"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => callback(setUpdateTransaction)}
                    className="px-4 py-2 ml-2 bg-blue-500 text-white rounded"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => callback(setDeleteTransaction)}
                    className="px-4 py-2 ml-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {deleteTransaction && (
            <DeleteAlert
              handleDeleteTransaction={handleDeleteTransaction}
              setDeleteTransaction={setDeleteTransaction}
            />
          )}
          {showColumnPopup && (
            <Dialog open={showColumnPopup} onOpenChange={setShowColumnPopup}>
              <DialogContent className="md:min-w-96 w-72">
                <DialogHeader>
                  <DialogTitle>Manage Columns</DialogTitle>
                </DialogHeader>
                <div className="mb-4 flex flex-wrap justify-between">
                  {[
                    "ID",
                    "Name",
                    "Date",
                    "Amount",
                    "Description",
                    "Type",
                    "Category",
                    "Actions",
                  ].map((column) => (
                    <Label
                      key={column}
                      onClick={() => toggleColumn(column)}
                      className="flex md:w-min w-32 justify-start items-center mb-2"
                    >
                      <Checkbox
                        checked={columns.includes(column)}
                        className="mr-2 w-5 h-5"
                      />
                      {column}
                    </Label>
                  ))}
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setShowColumnPopup(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {showFilterPopup && (
            <Dialog open={showFilterPopup} onOpenChange={setShowFilterPopup}>
              <DialogContent className="md:min-w-96 w-72">
                <DialogHeader>
                  <DialogTitle>Add Filters</DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">
                    Type
                  </Label>
                  <div className="mt-1 flex space-x-4">
                    <div className="flex items-center justify-center">
                      <Input
                        type="radio"
                        name="type"
                        value="all"
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        checked={filters.type === "all"}
                        onChange={handleFilterChange}
                      />
                      <Label className="ml-2 block text-sm text-gray-700">
                        All
                      </Label>
                    </div>
                    <div className="flex items-center justify-center">
                      <Input
                        type="radio"
                        name="type"
                        value="credit"
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        checked={filters.type === "credit"}
                        onChange={handleFilterChange}
                      />
                      <Label className="ml-2 block text-sm text-gray-700">
                        credit
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Input
                        type="radio"
                        name="type"
                        value="debit"
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        checked={filters.type === "debit"}
                        onChange={handleFilterChange}
                      />
                      <Label className="ml-2 block text-sm text-gray-700">
                        debit
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="block mb-2">Category</Label>
                  <Select
                    name="category"
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange({
                        target: { name: "category", value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                  >
                    <SelectTrigger className="mt-1 block w-full px-3 p-2 border rounded py-2 border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setShowFilterPopup(false)}
                    className="px-4 py-2 rounded"
                  >
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <TableHeader>
              <TableRow className="bg-gray-200">
                {columns.includes("ID") && (
                  <TableHead className="border p-3 text-left">ID</TableHead>
                )}
                {columns.includes("Name") && (
                  <TableHead className="border p-3 text-left">Name</TableHead>
                )}
                {columns.includes("Amount") && (
                  <TableHead className="border p-3 text-left">Amount</TableHead>
                )}
                {columns.includes("Date") && (
                  <TableHead className="border p-3 text-left">Date</TableHead>
                )}
                {columns.includes("Type") && (
                  <TableHead className="border p-3 text-left">Type</TableHead>
                )}
                {columns.includes("Category") && (
                  <TableHead className="border p-3 text-left">
                    Category
                  </TableHead>
                )}
                {columns.includes("Description") && (
                  <TableHead className="border p-3 text-left">
                    Description
                  </TableHead>
                )}
                {columns.includes("Actions") && (
                  <TableHead className="border p-3 text-left">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredTransactions ||
                (filteredTransactions.length === 0 && (
                  <TableRow className="h-32 opacity-80">
                    <TableCell colSpan={columns.length} className="text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ))}

              {filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction._id}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {columns.includes("ID") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className="border p-3"
                    >
                      {transaction._id}
                    </TableCell>
                  )}
                  {columns.includes("Name") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className="border p-3"
                    >
                      {transaction.name}
                    </TableCell>
                  )}
                  {columns.includes("Amount") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className={`border p-3 ${
                        transaction.type === "credit"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {transaction.amount}
                    </TableCell>
                  )}
                  {columns.includes("Date") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className="border p-3"
                    >
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                  )}
                  {columns.includes("Type") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className="border p-3"
                    >
                      {transaction.type}
                    </TableCell>
                  )}
                  {columns.includes("Category") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className="border p-3"
                    >
                      {transaction.category}
                    </TableCell>
                  )}
                  {columns.includes("Description") && (
                    <TableCell
                      onClick={() => handleRowClick(transaction)}
                      className="border p-3"
                    >
                      {transaction.description}
                    </TableCell>
                  )}
                  {columns.includes("Actions") && (
                    <TableCell className="border p-3 flex gap-2 md:gap-4">
                      <Trash
                        color="red"
                        onClick={() => setDeleteTransaction(transaction)}
                        className="w-4 h-4"
                      />
                      <Pen
                        onClick={() => setUpdateTransaction(transaction)}
                        color="black"
                        className="w-4 h-4"
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default TransactionsPage;
