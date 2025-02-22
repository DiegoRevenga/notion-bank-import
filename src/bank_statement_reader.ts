import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { CATEGORIES, REVOLUT_ACC } from "./notion/notionKeys";
import { Expense, Income, ParsedTransactions } from "./types";

interface CSVTransaction {
  Description: string;
  Amount: string;
  "Started Date": string;
}

export function getTranstactions() {
  const csvTxs = readBankStatement();
  const txs = parseTransactions(csvTxs);

  return txs;
}

function readBankStatement() {
  const csvFilePath =
    "bank_statements/account-statement_2025-02-01_2025-02-22_es_23180b.csv"; // TODO Read the whole folder

  const csvFile = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  const transactions = parse(csvFile, {
    bom: true,
    columns: true,
  }) as CSVTransaction[];

  return transactions;
}

function parseTransactions(transactions: CSVTransaction[]): ParsedTransactions {
  const expenses: Expense[] = [];
  const incomes: Income[] = [];

  for (const tx of transactions) {
    // Expense
    if (Number.parseInt(tx.Amount) <= 0) {
      expenses.push({
        Date: tx["Started Date"],
        Title: tx.Description,
        Amount: -Number.parseInt(tx.Amount),
        CategoryId: CATEGORIES.Investments, // TODO Set category
        AccountId: REVOLUT_ACC,
      });
    }
    // Income
    else {
      incomes.push({
        Date: tx["Started Date"],
        Title: tx.Description,
        Amount: Number.parseInt(tx.Amount),
        AccountId: REVOLUT_ACC,
      });
    }
  }

  return {
    expenses: expenses,
    incomes: incomes,
  };
}
