import jaLocale from "@fullcalendar/core/locales/ja";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import type React from "react";
import "../calendar.css";
import type { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import type { Balance, CalenderContent, Transaction } from "../types";
import { calculateDailyBalance } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface CalendarProps {
	monthlyTransactions: Transaction[];
	setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}
const Calendar = ({ monthlyTransactions, setCurrentMonth }: CalendarProps) => {
	const events = [
		{ title: "Meeting", start: "2024-12-10" },
		{
			title: "Conference",
			start: "2024-12-34",
			income: "10000",
			expense: "5000",
			balance: "5000",
		},
	];
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

	const handleDateSet = (datesetInfo: DatesSetArg) => {
		setCurrentMonth(datesetInfo.view.currentStart);
	};

	return (
		<FullCalendar
			locale={jaLocale}
			plugins={[dayGridPlugin]}
			initialView="dayGridMonth"
			events={calendarEvents}
			eventContent={renderEventContent}
			datesSet={handleDateSet}
		/>
	);
};

export default Calendar;
