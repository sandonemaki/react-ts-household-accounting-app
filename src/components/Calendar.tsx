import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import type React from "react";
import "../calendar.css";
import type { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import interactionPlugin, {
	type DateClickArg,
} from "@fullcalendar/interaction";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import type { Balance, CalenderContent, Transaction } from "../types";
import { calculateDailyBalance } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface CalendarProps {
	monthlyTransactions: Transaction[];
	setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
	setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
	currentDay: string;
	today: string;
  onDateClick: (date: DateClickArg) => void;
}

const Calendar = ({
	monthlyTransactions,
	setCurrentMonth,
	setCurrentDay,
	currentDay,
	today,
  onDateClick,
}: CalendarProps) => {
	const theme = useTheme();

	//カレンダーイベントの見た目を作る関数
	const renderEventContent = (eventInfo: EventContentArg) => {
		return (
			<div>
				<div className="money" id="event-income">
					{eventInfo.event.extendedProps.income}
				</div>
				<div className="money" id="event-expense">
					{eventInfo.event.extendedProps.expense}
				</div>
				<div className="money" id="event-balance">
					{eventInfo.event.extendedProps.balance}
				</div>
			</div>
		);
	};

	const dailyBalance = calculateDailyBalance(monthlyTransactions);

	// FullCalender用のイベントを作る関数
	const createCalenderEvents = (
		dailyBalance: Record<string, Balance>,
	): CalenderContent[] => {
		return Object.keys(dailyBalance).map((date) => {
			const { income, expense, balance } = dailyBalance[date];
			return {
				start: date,
				income: formatCurrency(income),
				expense: formatCurrency(expense),
				balance: formatCurrency(balance),
			};
		});
	};

	const calendarEvents = createCalenderEvents(dailyBalance);

	const backgroundEvent = {
		start: currentDay,
		display: "background",
		backgroundColor: theme.palette.incomeColor.light,
	};

	// 月の日付取得
	const handleDateSet = (datesetInfo: DatesSetArg) => {
		const currentMonth = datesetInfo.view.currentStart;
		setCurrentMonth(currentMonth);
		if (isSameMonth(currentMonth, new Date())) {
			setCurrentDay(today);
		}
	};



	return (
		<FullCalendar
			locale={jaLocale}
			plugins={[dayGridPlugin, interactionPlugin]}
			initialView="dayGridMonth"
			events={[...calendarEvents, backgroundEvent]}
			eventContent={renderEventContent}
			datesSet={handleDateSet}
			dateClick={onDateClick}
		/>
	);
};

export default Calendar;
