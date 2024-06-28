import { Account } from "../models/AccountModel";

export class AccountRepository {
  async findAccountByOwner(owner: string) {
    try {
      const account = await Account.findOne({ owner });
      await account?.populate("transactions");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }

  async findAccountByOwnerId(ownerId: string) {
    try {
      const account = await Account.findById(ownerId);
      await account?.populate("transactions");

      return account;
    } catch (error) {
      throw new Error("Account not found");
    }
  }
}
