import { Account } from "../models/AccountModel";
import { Transaction } from "../models/TransactionModel";
import { CreateTransactionProps } from "../types";

export class TransactionService {
  async createTransaction({ owner, type, amount, to }: CreateTransactionProps) {
    const transaction = new Transaction({
      from: owner._id,
      type,
      to: to ? to._id : null,
      amount,
      effectiveDate: new Date(),
    });

    await transaction.save();

    const promises = [
      await Account.findByIdAndUpdate(owner._id, {
        balance:
          type === "deposit" ? owner.balance + amount : owner.balance - amount,
        $push: { transactions: transaction._id },
      }),
    ];

    if (to) {
      promises.push(
        await Account.findByIdAndUpdate(to, {
          balance: to.balance + amount,
          $push: { transactions: transaction._id },
        }),
      );
    }

    await Promise.all(promises);

    return transaction;
  }
}
