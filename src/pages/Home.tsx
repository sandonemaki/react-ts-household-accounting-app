import { Box } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import Calendar from "../components/Calendar";
import MonthlySummary from "../components/MonthlySummary";
import TransactionMenu from "../components/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";
import type { Transaction } from "../types";

interface HomeProps {
	monthlyTransactions: Transaction[];
	setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
	const today = format(new Date(), "yyyy-MM-dd");
	const [currentDay, setCurrentDay] = useState(today);

	const dailyTransactions = monthlyTransactions.filter((transaction) => {
		return transaction.date === currentDay;
	});
	return (
		<Box sx={{ display: "flex" }}>
			{/* 左側コンテンツ */}
			<Box sx={{ flexGrow: 1, bgcolor: "pink" }}>
				<MonthlySummary monthlyTransactions={monthlyTransactions} />
				<Calendar
					monthlyTransactions={monthlyTransactions}
					setCurrentMonth={setCurrentMonth}
					setCurrentDay={setCurrentDay}
				/>
			</Box>

			{/* 右側コンテンツ */}
			<Box>
				<TransactionMenu
					dailyTransactions={dailyTransactions}
					currentDay={currentDay}
				/>
				<TransactionForm />
			</Box>
		</Box>
	);
};

export default Home;
