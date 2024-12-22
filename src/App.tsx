import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.tsx";
import Home from "./pages/Home.tsx";
import Nomatch from "./pages/Nomatch.tsx";
import Report from "./pages/Report.tsx";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route index element={<Home />} />
					<Route path="/report" element={<Report />} />
					<Route path="*" element={<Nomatch />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
