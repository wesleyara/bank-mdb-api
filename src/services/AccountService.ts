/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { decryptHash, generateHash } from "../lib/generateHash";
import { createToken, verifyToken } from "../lib/jwt";
import { Account } from "../models/AccountModel";
import { AccountRepository } from "../repositories/AccountRepository";
import {
  CreateAccountProps,
  DepositAndWithdrawProps,
  GetAccountProps,
  TransferProps,
} from "../types";
import { SECRET } from "../utils/constants";
import { TransactionService } from "./TransactionService";

export class AccountService {
  constructor(
    private accountRepository = new AccountRepository(),
    private transactionService = new TransactionService(),
  ) {
    console.log("AccountService constructor");
  }

  async createAccount({ owner, password }: CreateAccountProps) {
    try {
      const existingAccount = await this.accountRepository.findAccountByOwner(
        owner,
      );

      if (existingAccount) {
        throw new Error("Account already exists");
      }

      const passwordHash = generateHash(password, SECRET);

      const account = new Account({
        owner,
        password: passwordHash,
      });

      await account.save();
    } catch (error) {
      console.log(error);
    }
  }

  async login({ owner, password }: CreateAccountProps) {
    const account = await this.accountRepository.findAccountByOwner(owner);

    if (!account) {
      throw new Error("Account not found");
    }

    const decryptedPassword = decryptHash(account.password, SECRET);

    if (decryptedPassword !== password) {
      throw new Error("Invalid password");
    }

    const token = createToken(account._id);

    return token;
  }

  async getAccountByToken({ token }: GetAccountProps) {
    if (!token) {
      throw new Error("Token not provided");
    }

    const decoded: any = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const account = await this.accountRepository.findAccountByOwnerId(
      decoded.id,
    );

    if (!account) {
      throw new Error("Account not found");
    }

    const accountWithoutPassword = {
      ...account.toObject(),
      password: undefined,
    };

    return accountWithoutPassword;
  }

  async deposit({ token, amount }: DepositAndWithdrawProps) {
    const decoded: any = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const accountOwner = await this.accountRepository.findAccountByOwnerId(
      decoded.id,
    );

    if (!accountOwner) {
      throw new Error("Account not found");
    }

    await this.transactionService.createTransaction({
      owner: accountOwner,
      type: "deposit",
      amount,
      to: null,
    });
  }

  async withdraw({ token, amount }: DepositAndWithdrawProps) {
    const decoded: any = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const accountOwner = await this.accountRepository.findAccountByOwnerId(
      decoded.id,
    );

    if (!accountOwner) {
      throw new Error("Account not found");
    }

    if (accountOwner.balance < amount) {
      throw new Error("Insufficient funds");
    }

    await this.transactionService.createTransaction({
      owner: accountOwner,
      type: "withdraw",
      amount,
      to: null,
    });
  }

  async transfer({ token, to, amount }: TransferProps) {
    const decoded: any = verifyToken(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    const [accountOwner, accountTo] = await Promise.all([
      this.accountRepository.findAccountByOwnerId(decoded.id),
      this.accountRepository.findAccountByOwnerId(to),
    ]);

    if (!accountOwner || !accountTo) {
      throw new Error("Account not found");
    }

    if (accountOwner.balance < amount) {
      throw new Error("Insufficient funds");
    }

    await this.transactionService.createTransaction({
      owner: accountOwner,
      type: "transfer",
      amount,
      to: accountTo,
    });
  }
}
