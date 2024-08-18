export interface Account {
    id?: number;
    accountName: string;
    accountDetails: string;
    accountType: string;
    accountAddress: string;
    initialBalance: number;
    currentBalance: number;
    notes?: string;
  }
  