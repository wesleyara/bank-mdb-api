import { model, Schema, Document } from "mongoose";

import { ITransaction } from "./TransactionModel";

export interface IAccount extends Document {
  owner: string;
  password: string;
  balance: number;
  transactions: ITransaction[];
}

const AccountSchema = new Schema({
  owner: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

const Account = model<IAccount>("Account", AccountSchema);

export { Account };
