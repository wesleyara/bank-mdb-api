import { IAccount } from "../models/AccountModel";

export interface CreateAccountProps {
  owner: string;
  password: string;
}

export interface GetAccountProps {
  token: string;
}

export interface DepositAndWithdrawProps {
  token: string;
  amount: number;
}

export interface TransferProps {
  token: string;
  to: string;
  amount: number;
}

export interface CreateTransactionProps {
  owner: IAccount;
  type: string;
  amount: number;
  to: IAccount | null;
}
