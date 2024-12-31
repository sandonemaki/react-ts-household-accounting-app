import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import React from "react";

const Calendar = () => {
	return <FullCalendar plugins={[dayGridPlugin]} />;
};

export default Calendar;
