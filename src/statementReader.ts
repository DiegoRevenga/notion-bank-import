import fs from "node:fs";
const readline = require("readline");
import { parse } from "csv-parse/sync";
import { CATEGORIES, REVOLUT_ACC } from "./notion/notionKeys";
import { Expense, Income, ParsedTransactions } from "./types";
import categoriesMenu from "./util/categoriesMenu";

interface CSVTransaction {
  Description: string;
  Amount: string;
  "Started Date": string;
  State: string;
}

export async function getTranstactions() {
  const csvTxs = readBankStatement();
  const txs = parseTransactions(csvTxs);
  await setCategories(txs.expenses);

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
    if (tx.State === "REVERTED") continue;

    // Expense
    if (Number.parseInt(tx.Amount) <= 0) {
      expenses.push({
        Date: tx["Started Date"],
        Title: tx.Description,
        Amount: -Number.parseInt(tx.Amount),
        CategoryId: "",
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

async function setCategories(expenses: Expense[]) {
  console.clear();

  // TODO Print all categories
  const { stringMenu, menuMap } = categoriesMenu(CATEGORIES);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  for (const ex of expenses) {
    // Print menu
    console.log(stringMenu, "\n");
    console.log(`${ex.Title} - ${ex.Amount}€ - ${ex.Date}`);

    // Wait for user input
    const key: string = await new Promise((resolve) => {
      rl.question("\n>>> ", (key: string) => {
        resolve(key);
      });
    });

    // Assign category
    const catId = menuMap.get(key.toLowerCase());
    if (catId) {
      ex.CategoryId = catId;
    }

    console.clear();
  }

  rl.close();
}
