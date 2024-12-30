import React, { use, useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { Css } from "@mui/icons-material";
import { CssBaseline } from "@mui/material";
import { format } from "date-fns";
import { collection, getDocs } from "firebase/firestore";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { db } from "./firebase";
import Home from "./pages/Home";
import Nomatch from "./pages/Nomatch";
import Report from "./pages/Report";
import { theme } from "./theme/theme";
import type { Transaction } from "./types/index";
import { formatMonth } from "./utils/formatting";

function isFireStoreError(
	err: unknown,
): err is { code: string; message: string } {
	return (
		typeof err === "object" && err !== null && "code" in err && "message" in err
	);
}
function App() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "Transactions"));
				console.log(querySnapshot);

				const transactionsData = querySnapshot.docs.map((doc) => {
					// doc.data() is never undefined for query doc snapshots
					// console.log(doc.id, " => ", doc.data());
					return {
						...doc.data(),
						id: doc.id,
					} as Transaction;
				});
				setTransactions(transactionsData);
				console.log(transactionsData);
			} catch (err) {
				if (isFireStoreError(err)) {
					console.error("firestoreエラーは", err);
				} else {
					console.error("一般的なエラーは", err);
				}
				// error
			}
		};
		fetchTransactions();
	}, []);
	const monthlyTransactions = transactions.filter((transaction) => {
		return transaction.date.startsWith(formatMonth(currentMonth));
	});
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<AppLayout />}>
						<Route
							index
							element={<Home monthlyTransaction={monthlyTransactions} />}
						/>
						<Route path="/report" element={<Report />} />
						<Route path="*" element={<Nomatch />} />
					</Route>
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
