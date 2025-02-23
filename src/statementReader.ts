import fs from "node:fs";
const readline = require("readline");
import { parse } from "csv-parse/sync";
import { CATEGORIES, ACCOUNT } from "./notion/notionKeys";
import { Expense, Income, ParsedTransactions } from "./types";
import categoriesMenu from "./util/categoriesMenu";

interface CSVTransaction {
  Description: string;
  Amount: string;
  "Started Date": string;
  State: string;
}

export async function getTranstactions(csvPath: string) {
  const csvTxs = readBankStatement(csvPath);
  const txs = parseTransactions(csvTxs);
  // await setCategories(txs.expenses);

  return txs;
}

function readBankStatement(csvPath: string) {
  const csvFile = fs.readFileSync(csvPath, { encoding: "utf-8" });

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
        AccountId: ACCOUNT,
      });
    }
    // Income
    else {
      incomes.push({
        Date: tx["Started Date"],
        Title: tx.Description,
        Amount: Number.parseInt(tx.Amount),
        AccountId: ACCOUNT,
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
