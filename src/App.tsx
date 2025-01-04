import React, { use, useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { Css } from "@mui/icons-material";
import { CssBaseline } from "@mui/material";
import { format } from "date-fns";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { db } from "./firebase";
import Home from "./pages/Home";
import Nomatch from "./pages/Nomatch";
import Report from "./pages/Report";
import { theme } from "./theme/theme";
import type { Transaction } from "./types/index";
import { formatMonth } from "./utils/formatting";
import { Schema } from "./validations/schema";
// import { Schema } from "zod";

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
				// console.log(querySnapshot);

				const transactionsData = querySnapshot.docs.map((doc) => {
					// doc.data() is never undefined for query doc snapshots
					// console.log(doc.id, " => ", doc.data());
					return {
						...doc.data(),
						id: doc.id,
					} as Transaction;
				});
				setTransactions(transactionsData);
				// console.log(transactionsData);
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

  // 取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    console.log(transaction);
    try {
      // firestoreに保存
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Transactions"), transaction);
      // console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransaction) =>[...prevTransaction, newTransaction]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreエラーは", err);
      } else {
        console.error("一般的なエラーは", err);
      }
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      // firestoreから削除
      await deleteDoc(doc(db, "Transactions", transactionId));

    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("firestoreエラーは", err);
      } else {
        console.error("一般的なエラーは", err);
      }
    }
  };

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<AppLayout />}>
						<Route
							index
							element={
								<Home
									monthlyTransactions={monthlyTransactions}
									setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
								/>
							}
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
