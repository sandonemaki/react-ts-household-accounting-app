import { Box, useMediaQuery, useTheme, useThemeProps } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import Calendar from "../components/Calendar";
import MonthlySummary from "../components/MonthlySummary";
import TransactionForm from "../components/TransactionForm";
import TransactionMenu from "../components/TransactionMenu";
import type { Transaction } from "../types";
import { Schema } from "../validations/schema";
import { DateClickArg } from "@fullcalendar/interaction";

interface HomeProps {
	monthlyTransactions: Transaction[];
	setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

export const Home = ({
  monthlyTransactions,
  setCurrentMonth,
  onSaveTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
}: HomeProps) => {
	const today = format(new Date(), "yyyy-MM-dd");
	const [currentDay, setCurrentDay] = useState(today);
	const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
		return transaction.date === currentDay;
	});

	const closeForm = () => {
		setIsEntryDrawerOpen(!isEntryDrawerOpen);
    setSelectedTransaction(null);
	};

	// フォームの開閉処理
	const handleAddTransactionForm = () => {
    if (selectedTransaction) {
      setSelectedTransaction(null);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
	};

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setIsEntryDrawerOpen(true);
    setSelectedTransaction(transaction);
  };

  // モバイル用Drawerを閉じる処理
  const handleCloseDrawer = () => {
    setIsMobileDrawerOpen(false);
  }
  // 日付を選択したときの処理
  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log(dateInfo);
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
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
          onDateClick={handleDateClick}
				/>
			</Box>

			{/* 右側コンテンツ */}
			<Box>
				<TransactionMenu
					dailyTransactions={dailyTransactions}
					currentDay={currentDay}
					onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseDrawer}
				/>
				<TransactionForm
					onCloseForm={closeForm}
					isEntryDrawerOpen={isEntryDrawerOpen}
					currentDay={currentDay}
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
          onDeleteTransaction={onDeleteTransaction}
          setSlectedTransaction={setSelectedTransaction}
          onUpdateTransaction={onUpdateTransaction}
          isMobile={isMobile}
				/>
			</Box>
		</Box>
	);
};

export default Home;
