export interface Expense {
  Date: string;
  Title: string;
  Amount: number;
  CategoryId: string;
  AccountId: string;
}

export interface Income {
  Date: string;
  Title: string;
  Amount: number;
  AccountId: string;
}

export interface ParsedTransactions {
  expenses: Expense[];
  incomes: Income[];
}
