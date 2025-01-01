import { T } from "@fullcalendar/core/internal-common";
import { Box, Card, CardContent, Grid, Theme, Typography } from "@mui/material";
import React from "react";
import { theme } from "../theme/theme";
import type { Transaction } from "../types";
import { finaceCalculations } from "../utils/financeCalculations";
import { formatCurrency } from "../utils/formatting";

interface DailySummaryProps {
	dailyTransactions: Transaction[];
}

const DailySummary = ({ dailyTransactions }: DailySummaryProps) => {
	const { income, expense, balance } = finaceCalculations(dailyTransactions);
	return (
		<Box>
			<Grid container spacing={2}>
				{/* 収入 */}
				<Grid item xs={6} display={"flex"}>
					<Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
						<CardContent>
							<Typography variant="body2" noWrap textAlign="center">
								収入
							</Typography>
							<Typography
								color={theme.palette.incomeColor.main}
								textAlign="right"
								fontWeight="fontWeightBold"
								sx={{ wordBreak: "break-all" }}
							>
								¥{formatCurrency(income)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				{/* 支出 */}
				<Grid item xs={6} display={"flex"}>
					<Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
						<CardContent>
							<Typography variant="body2" noWrap textAlign="center">
								支出
							</Typography>
							<Typography
								color={theme.palette.expenseColor.main}
								textAlign="right"
								fontWeight="fontWeightBold"
								sx={{ wordBreak: "break-all" }}
							>
								¥{formatCurrency(expense)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				{/* 残高 */}
				<Grid item xs={12} display={"flex"}>
					<Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
						<CardContent>
							<Typography variant="body2" noWrap textAlign="center">
								残高
							</Typography>
							<Typography
								color={theme.palette.balanceColor.main}
								textAlign="right"
								fontWeight="fontWeightBold"
								sx={{ wordBreak: "break-all" }}
							>
								¥{formatCurrency(balance)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
};
export default DailySummary;
