export interface Expense {
    id?: number;
    month: string;
    expenseType: string;
    expenseAmount: number;
    createdAt: string; // Use ISO string format for date
  }
  