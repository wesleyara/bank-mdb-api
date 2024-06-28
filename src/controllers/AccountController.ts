import { Request, Response } from "express";
import { AccountService } from "../services/AccountService";
import { tokenAuth } from "../lib/jwt";

export class AccountController {
  constructor(private accountService = new AccountService()) {
    console.log("AccountController constructor");
  }

  async createAccount(req: Request, res: Response) {
    try {
      const { owner, password } = req.body;

      await this.accountService.createAccount({
        owner,
        password,
      });

      res.status(201).json({ message: "Account created" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { owner, password } = req.body;

      const token = await this.accountService.login({ owner, password });

      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAccount(req: Request, res: Response) {
    try {
      const bearerToken = tokenAuth(req, res);

      if (!bearerToken) {
        throw new Error("Token not found");
      }

      const account = await this.accountService.getAccountByToken({
        token: bearerToken,
      });

      res.status(200).json({ account });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      const bearerToken = tokenAuth(req, res);

      if (!bearerToken) {
        throw new Error("Token not found");
      }

      const { amount } = req.body;

      if (!amount) {
        throw new Error("Amount not provided");
      }

      await this.accountService.deposit({ amount, token: bearerToken });

      res.status(200).json({ message: "Deposit successful" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async withdraw(req: Request, res: Response) {
    try {
      const bearerToken = tokenAuth(req, res);

      if (!bearerToken) {
        throw new Error("Token not found");
      }

      const { amount } = req.body;

      if (!amount) {
        throw new Error("Amount not provided");
      }

      await this.accountService.withdraw({ amount, token: bearerToken });

      res.status(200).json({ message: "Withdraw successful" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async transfer(req: Request, res: Response) {
    try {
      const bearerToken = tokenAuth(req, res);

      if (!bearerToken) {
        throw new Error("Token not found");
      }

      const { to, amount } = req.body;

      if (!to || !amount) {
        throw new Error("To or amount not provided");
      }

      await this.accountService.transfer({
        to,
        amount,
        token: bearerToken,
      });

      res.status(200).json({ message: "Transfer successful" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
