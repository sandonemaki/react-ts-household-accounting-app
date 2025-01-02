import { Box } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import Calendar from "../components/Calendar";
import MonthlySummary from "../components/MonthlySummary";
import TransactionForm from "../components/TransactionForm";
import TransactionMenu from "../components/TransactionMenu";
import type { Transaction } from "../types";

interface HomeProps {
	monthlyTransactions: Transaction[];
	setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
	const today = format(new Date(), "yyyy-MM-dd");
	const [currentDay, setCurrentDay] = useState(today);
	const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

	const dailyTransactions = monthlyTransactions.filter((transaction) => {
		return transaction.date === currentDay;
	});

	const closeForm = () => {
		setIsEntryDrawerOpen(!isEntryDrawerOpen);
	};

	// フォームの開閉処理
	const handleAddTransactionForm = () => {
		setIsEntryDrawerOpen(!isEntryDrawerOpen);
	};
	return (
		<Box sx={{ display: "flex" }}>
			{/* 左側コンテンツ */}
			<Box sx={{ flexGrow: 1, bgcolor: "pink" }}>
				<MonthlySummary monthlyTransactions={monthlyTransactions} />
				<Calendar
					monthlyTransactions={monthlyTransactions}
					setCurrentMonth={setCurrentMonth}
					setCurrentDay={setCurrentDay}
					currentDay={currentDay}
					today={today}
				/>
			</Box>

			{/* 右側コンテンツ */}
			<Box>
				<TransactionMenu
					dailyTransactions={dailyTransactions}
					currentDay={currentDay}
					onAddTransactionForm={handleAddTransactionForm}
				/>
				<TransactionForm
					onCloseForm={closeForm}
					isEntryDrawerOpen={isEntryDrawerOpen}
					currentDay={currentDay}
				/>
			</Box>
		</Box>
	);
};

export default Home;
