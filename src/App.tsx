import React, { use, useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { Css } from "@mui/icons-material";
import { CssBaseline } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { db } from "./firebase";
import Home from "./pages/Home";
import Nomatch from "./pages/Nomatch";
import Report from "./pages/Report";
import { theme } from "./theme/theme";
import type { Transaction } from "./types/index";

function App() {
	function isFireStoreError(
		err: unknown,
	): err is { code: string; message: string } {
		return (
			typeof err === "object" &&
			err !== null &&
			"code" in err &&
			"message" in err
		);
	}
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "Transactions"));
				console.log(querySnapshot);

				// biome-ignore lint/complexity/noForEach: <explanation>
				const transactionsData = querySnapshot.docs.map((doc) => {
					// doc.data() is never undefined for query doc snapshots
					// console.log(doc.id, " => ", doc.data());
					return {
						...doc.data(),
						id: doc.id,
					} as Transaction;
				});
				console.log(transactionsData);
			} catch (err) {
				if (isFireStoreError(err)) {
					console.error(err);
					console.error(err.message);
					console.error(err.code);
				} else {
					console.error("一般的なエラーは", err);
				}
				// error
			}
		};
		fetchTransactions();
	}, []);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<AppLayout />}>
						<Route index element={<Home />} />
						<Route path="/report" element={<Report />} />
						<Route path="*" element={<Nomatch />} />
					</Route>
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
