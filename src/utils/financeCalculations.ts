import type { Balance, Transaction } from "../types";

export function finaceCalculations(transactions: Transaction[]): Balance {
	return transactions.reduce(
		(acc, transaction) => {
			if (transaction.type === "income") {
				acc.income += transaction.amount;
			} else {
				acc.expense += transaction.amount;
			}
			acc.balance = acc.income - acc.expense;
			return acc;
		},
		{
			income: 0,
			expense: 0,
			balance: 0,
		},
	);
}

// 1. 日付ごとの収支を計算する関数
export function calculateDailyBalance(
	transactions: Transaction[],
): Record<string, Balance> {
	return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
		const date = transaction.date;
		if (!acc[date]) {
			acc[date] = {
				income: 0,
				expense: 0,
				balance: 0,
			};
		}
		if (transaction.type === "income") {
			acc[date].income += transaction.amount;
		} else {
			acc[date].expense += transaction.amount;
		}
		acc[date].balance = acc[date].income - acc[date].expense;
		return acc;
	}, {});
}
