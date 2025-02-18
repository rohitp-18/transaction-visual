import Transaction from "../../../../models/transactionModel";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// export default async function handler(
//   req: NextRequest,
//   res: NextResponse
// ) {
//   if (mongoose.connection.readyState !== 1) {
//     try {
//       if (!process.env.MONGODB_URI) {
//         throw new Error("MongoDB URI is missing");
//       }
//       await mongoose.connect(process.env.MONGODB_URI);
//       console.log("Connected to MongoDB");
//     } catch (error) {
//       console.error("Error connecting to MongoDB", error);
//       res.status(500).json({ error: "Error connecting to database" });
//       return;
//     }
//   }
//   if (req.method === "POST") {
//     try {
//       const { amount, date, description, type, category } = req.body;
//       console.log(amount, date, description, type, category);
//       const transaction = await Transaction.create(req.body);
//       await transaction.save();
//       res.status(201).json(transaction);
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   } else if (req.method === "GET") {
//     try {
//       const transactions = await Transaction.find();
//       res.status(200).json(transactions);
//     } catch (error: any) {
//       res.status(400).json({ error: error.message });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        if (!process.env.MONGODB_URI) {
          throw new Error("MongoDB URI is missing");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("Error connecting to MongoDB", error);
        return NextResponse.json(
          { error: "Error connecting to database" },
          { status: 500 }
        );
      }
    }
    const body = await req.json();
    const { name, amount, date, type, category, description } = body;
    console.log(name, amount, date, type, category);
    const transaction = await Transaction.create({
      name,
      amount,
      date,
      description,
      type,
      category,
    });
    await transaction.save();
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        if (!process.env.MONGODB_URI) {
          throw new Error("MongoDB URI is missing");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("Error connecting to MongoDB", error);
        return NextResponse.json(
          { error: "Error connecting to database" },
          { status: 500 }
        );
        return;
      }
    }
    const transactions = await Transaction.find();
    transactions.filter(
      (transaction) =>
        (transaction.data = new Date(transaction.date)
          .toISOString()
          .split("T")[0])
    );
    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
