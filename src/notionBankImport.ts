import { loadEnvVariables } from "./notion/notionKeys";
import { getTranstactions } from "./statementReader";
import sendTransactions from "./notion/sendTransactions";
import dotenv from "dotenv";
import errorColor from "./util/errorColor";

dotenv.config();

async function main() {
  if (process.argv.length === 2) {
    console.error(errorColor("Expected csv path!"));
    process.exit(1);
  }

  await loadEnvVariables();

  // Read csv
  const transactions = await getTranstactions(process.argv[2]);

  // Send to notion
  await sendTransactions(transactions);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
