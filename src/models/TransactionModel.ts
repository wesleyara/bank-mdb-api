import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  from: Types.ObjectId;
  type: "deposit" | "withdraw" | "transfer";
  to: Types.ObjectId | null;
  amount: number;
  effectiveDate: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  from: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  type: {
    type: String,
    enum: ["deposit", "withdraw", "transfer"],
    required: true,
  },
  to: { type: Schema.Types.ObjectId, ref: "Account", default: null },
  amount: { type: Number, required: true },
  effectiveDate: { type: Date, required: true },
});

const Transaction = model<ITransaction>("Transaction", TransactionSchema);

export { Transaction };
