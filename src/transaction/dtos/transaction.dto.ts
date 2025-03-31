import { TransactionDocument } from '../entities/transaction.entity';

export class TransactionDTO {
  private id: string;
  private walletId: string;
  private amount: number;
  private description: string;
  private balance: number;
  private date: Date;

  constructor(transaction: TransactionDocument) {
    this.id = transaction._id.toString();
    this.walletId = transaction.walletId.toString();
    this.amount = transaction.amount;
    this.description = transaction.description;
    this.balance = transaction.balance;
    this.date = transaction.createdAt;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getWalletId(): string {
    return this.walletId;
  }

  setWalletId(walletId: string): void {
    this.walletId = walletId;
  }

  getAmount(): number {
    return this.amount;
  }

  setAmount(amount: number): void {
    this.amount = amount;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getBalance(): number {
    return this.balance;
  }

  setBalance(balance: number): void {
    this.balance = balance;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date;
  }
}
