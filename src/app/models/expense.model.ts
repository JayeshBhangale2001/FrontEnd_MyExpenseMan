import { Account } from "./account.model";

export interface Expense {
  id?: number;
  account: Account; // Used for displaying data, not for sending
  expenseType: string;
  expenseAmount: number;
  expenseDate: Date; // Use Date object for frontend
  accountId: number; // Required for backend
}

export type PartialExpense = {
  id?: number;
  accountId: number; // Required for backend
  expenseType: string;
  expenseAmount: number;
  expenseDate: string; // Send as ISO string for backend
};
