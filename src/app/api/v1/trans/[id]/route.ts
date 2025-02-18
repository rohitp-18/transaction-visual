import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Transaction from "@/models/transactionModel";

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        if (!process.env.MONGODB_URI) {
          return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
          );
        }
        await mongoose.connect(process.env.MONGODB_URI);
      } catch (error) {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }
    }
    const body = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const { name, description, type, amount, category, date } = body;
    if (!name || !description || !type || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Please provide all the required fields" },
        { status: 400 }
      );
    }
    const tempTransaction = await Transaction.findById(id);

    if (!tempTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { name, description, type, amount, category, date },
      { new: true }
    );

    return NextResponse.json({ success: true, transaction }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        if (!process.env.MONGODB_URI) {
          return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
          );
        }
        await mongoose.connect(process.env.MONGODB_URI);
      } catch (error) {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }
    }
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const tempTransaction = await Transaction.findById(id);

    if (!tempTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    await Transaction.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
