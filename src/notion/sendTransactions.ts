import { Client } from "@notionhq/client";
import { Expense, Income, ParsedTransactions } from "../types";
import { EXPENSE_DB, INCOME_DB, NOTION_TOKEN } from "./notionKeys";

export default async function sendTransactions(txs: ParsedTransactions) {
  const notion = new Client({
    auth: NOTION_TOKEN,
  });

  // TODO Not send repeated txs (check by exact date and hour)

  const txsPromises = sendExpenses(notion, txs.expenses).concat(
    sendIncomes(notion, txs.incomes)
  );

  // Send all the transactions concurrently
  await Promise.allSettled(txsPromises);
}

function sendExpenses(notion: Client, expenses: Expense[]) {
  return expenses.map((ex) => {
    let args: any = {
      parent: { database_id: EXPENSE_DB },
      properties: {
        Date: {
          date: { start: ex.Date, time_zone: "Europe/Madrid" },
        },
        Expense: {
          title: [
            {
              text: { content: ex.Title },
            },
          ],
        },
        "Total Amount": { number: ex.Amount },
        Accounts: { relation: [{ id: ex.AccountId }] },
      },
      icon: {
        type: "external",
        external: {
          url: "https://www.notion.so/icons/upward_gray.svg",
        },
      },
    };

    // Add category only if exists
    if (ex.CategoryId) {
      args.Categories = { relation: [{ id: ex.CategoryId }] };
    }

    return notion.pages.create(args);
  });
}

function sendIncomes(notion: Client, incomes: Income[]) {
  return incomes.map((inc) =>
    notion.pages.create({
      parent: { database_id: INCOME_DB },
      properties: {
        Date: {
          date: { start: inc.Date, time_zone: "Europe/Madrid" },
        },
        Income: {
          title: [
            {
              text: { content: inc.Title },
            },
          ],
        },
        Amount: { number: inc.Amount },
        Accounts: { relation: [{ id: inc.AccountId }] },
      },
      icon: {
        type: "external",
        external: {
          url: "https://www.notion.so/icons/downward_gray.svg",
        },
      },
    })
  );
}
