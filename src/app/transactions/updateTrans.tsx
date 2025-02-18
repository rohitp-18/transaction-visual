"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
// import { Button, Input, Label, Select } from "shadcn-ui";

interface TransactionFormPageProps {
  transaction: any;
  setOpen: any;
  fetchTransactions: any;
}

const TransactionUpdate: React.FC<TransactionFormPageProps> = ({
  transaction,
  setOpen,
  fetchTransactions,
}) => {
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [type, setType] = React.useState("credit");
  const [date, setDate] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");

  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      name,
      amount,
      type,
      date,
      category,
      description,
    };
    console.log("Form Data: ", formData);

    fetch(`/api/v1/trans/${transaction._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        await res.json();
        fetchTransactions();
        setOpen(false);
        toast({
          description: "Transaction updated successfully",
          title: "success",
        });
      })
      .catch((err) => {
        toast({ description: "Transaction update failed", title: "error" });
      });
  };

  useEffect(() => {
    if (transaction) {
      setName(transaction.name);
      setAmount(transaction.amount);
      setType(transaction.type);
      setDate(new Date(transaction.date).toISOString().split("T")[0]);
      setCategory(transaction.category);
      setDescription(transaction.description);
    }
  }, [transaction]);

  return (
    <Dialog open={true} onOpenChange={() => setOpen(false)}>
      <DialogContent
        style={{ scrollbarWidth: "thin" }}
        className="md:min-w-96 w-72 max-h-full overflow-auto"
      >
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
        </DialogHeader>
        {/* <div className="py-5 w-full bg-gray-100 font-sans">
          <div className="w-full max-w-md mx-auto bg-white p-5 rounded-md shadow-md"> */}
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              type="text"
              className="input"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Amount
            </Label>
            <Input
              type="number"
              className="input"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Type
            </Label>
            <div className="mt-1 flex space-x-4">
              <div className="flex items-center">
                <Input
                  type="radio"
                  name="type"
                  value="credit"
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  checked={type === "credit"}
                  onChange={(e) => setType(e.target.value)}
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
                  checked={type === "debit"}
                  onChange={(e) => setType(e.target.value)}
                />
                <Label className="ml-2 block text-sm text-gray-700">
                  debit
                </Label>
              </div>
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Date
            </Label>
            <Input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label className="block text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="input w-full" style={{ width: "100%" }}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="enetertainment">Entertainment</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Description
            </Label>
            <Input
              type="text"
              className="input"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setOpen(false)}
              className="px-4 py-2 mr-3 shadow-sm bg-white border border-1 border-black text-black hover:text-white rounded"
            >
              Close
            </Button>
            <Button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Update Transaction
            </Button>
          </div>
        </form>
        {/* </div>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionUpdate;
