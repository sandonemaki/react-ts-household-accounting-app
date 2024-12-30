import React, { useState } from "react";
import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { Css } from "@mui/icons-material";
import { CssBaseline } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Nomatch from "./pages/Nomatch";
import Report from "./pages/Report";
import { theme } from "./theme/theme";
import type { Transaction } from "./types/index";

function App() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
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
