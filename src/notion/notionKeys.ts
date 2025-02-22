import { Client } from "@notionhq/client";
import assertDefined from "../util/assertDefined";

export let NOTION_TOKEN: string;
export let EXPENSE_DB: string;
export let INCOME_DB: string;
export let REVOLUT_ACC: string;
export const CATEGORIES = {
  Food: "",
  Shopping: "",
  Transport: "",
  Entertainment: "",
  Investments: "",
  "Health & Fitness": "",
  Groceries: "",
  "Party & Bars": "",
};

export async function loadEnvVariables() {
  NOTION_TOKEN = assertDefined(process.env.NOTION_TOKEN, "NOTION_TOKEN");
  EXPENSE_DB = assertDefined(process.env.EXPENSE_DB, "EXPENSE_DB");
  INCOME_DB = assertDefined(process.env.INCOME_DB, "INCOME_DB");
  REVOLUT_ACC = assertDefined(process.env.REVOLUT_ACC, "REVOLUT_ACC");

  const CATEGORIES_DB = assertDefined(
    process.env.CATEGORIES_DB,
    "CATEGORIES_DB"
  );
  await loadCategories(CATEGORIES_DB);
}

async function loadCategories(catDB: string) {
  const notion = new Client({
    auth: NOTION_TOKEN,
  });

  const categories = await notion.databases.query({
    database_id: catDB,
  });

  for (const cat of categories.results) {
    const catName = (cat as any).properties.Name.title[0].plain_text;

    CATEGORIES[catName as keyof typeof CATEGORIES] = cat.id;
  }
}
