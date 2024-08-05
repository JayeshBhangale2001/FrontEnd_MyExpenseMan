export interface Expense {
    id?: number;
    month: string;
    expenseType: string;
    expenseAmount: number;
    date: string; // Use ISO string format for date
  }
  