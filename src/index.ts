import { CATEGORIES, loadEnvVariables } from "./notion/notionKeys";
import { getTranstactions } from "./bank_statement_reader";
import sendTransactions from "./notion/sendTransactions";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  await loadEnvVariables();

  const transactions = getTranstactions();
  await sendTransactions(transactions);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
