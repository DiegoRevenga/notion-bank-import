# Notion Bank Import

**A simple script to read a csv of bank transactions and upload them to notion.**

> [!NOTE]
> To run it needs this env variables:
> - NOTION_TOKEN
> - EXPENSE_DB
> - INCOME_DB
> - CATEGORIES_DB
> - ACCOUNT

## CSV format
Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance

## Expenses Notion database
It has the following columns:
- Date
- Expense
- Total Amount
- Accounts

## Income Notion database
It has the following columns:
- Date
- Income
- Amount
- Accounts

<br>

> [!WARNING]
> **Assumptions**
> - Time zone is Europe/Madrid
> - All transactions are made from the same account (the one from you got the csv)
