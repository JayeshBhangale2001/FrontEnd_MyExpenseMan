export interface Expense {
    id?: number;
    month: string;
    expenseType: string;
    expenseAmount: number;
    expenseDate: string; // Use ISO string format for date
  }
  