import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  _id: string;
  name: string;
  amount: number;
  date: Date;
  description: string;
  type: "credit" | "debit";
  category: string;
}

const TransactionSchema: Schema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  category: { type: String, required: true },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export type { ITransaction };
export default Transaction;
