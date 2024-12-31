import { Box } from "@mui/material";
import Calendar from "../components/Calendar";
import MonthlySummary from "../components/MonthlySummary";
import TransactionForm from "../components/layout/TransactionForm";
import TransactionMenu from "../components/layout/TransactionMenu";
import type { Transaction } from "../types";

interface HomeProps {
	monthlyTransactions: Transaction[];
	setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
	return (
		<Box sx={{ display: "flex" }}>
			{/* 左側コンテンツ */}
			<Box sx={{ flexGrow: 1, bgcolor: "pink" }}>
				<MonthlySummary monthlyTransactions={monthlyTransactions} />
				<Calendar
					monthlyTransactions={monthlyTransactions}
					setCurrentMonth={setCurrentMonth}
				/>
			</Box>

			{/* 右側コンテンツ */}
			<Box>
				<TransactionMenu />
				<TransactionForm />
			</Box>
		</Box>
	);
};

export default Home;
