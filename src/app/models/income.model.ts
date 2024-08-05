export class Income {
  id?: number;
  month: string;
  source: string;
  amount: number;
  investments: string;
  date: string; // Add this line

  constructor(month: string, source: string, amount: number, investments: string, date: string) {
    this.month = month;
    this.source = source;
    this.amount = amount;
    this.investments = investments;
    this.date = date; // Add this line
  }
}
