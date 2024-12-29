import { Box } from "@mui/material";
import Calendar from "../components/layout/Calendar";
import MonthlySummary from "../components/layout/MonthlySummary";
import TransactionForm from "../components/layout/TransactionForm";
import TransactionMenu from "../components/layout/TransactionMenu";

const Home = () => {
	return (
		<Box sx={{ display: "flex" }}>
			{/* 左側コンテンツ */}
			<Box sx={{ flexGrow: 1, bgcolor: "pink" }}>
				<MonthlySummary />
				<Calendar />
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
