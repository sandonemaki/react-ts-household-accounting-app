import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { ExpenseCategory, IncomeCategory, Transaction, TransactionType } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);
interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean
}

const CategoryChart = ({monthlyTransactions, isLoading}: CategoryChartProps) => {
  const theme = useTheme()
  const [selectedType, setSelectedType] = useState<TransactionType>("expense");
  const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    setSelectedType(e.target.value as TransactionType);
  };

  // カテゴリごとの合計金額計算
  const categorySums = monthlyTransactions
  .filter((transaction) => transaction.type === selectedType)
  .reduce<Record<string, number>>((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = 0;
    }
    acc[transaction.category] += transaction.amount;
    return acc;
  }, {});

    const categoryLabels = Object.keys(categorySums)
    const categoryValues = Object.values(categorySums)

    //収入用カテゴリカラー
  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };

  //支出用カテゴリカラー
  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    交通費: theme.palette.expenseCategoryColor.交通費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
  };
  const getCategoryColor = (category: string) => {
    if (selectedType === "income") {
      return incomeCategoryColor[category as IncomeCategory] || '';
    } else {
      return expenseCategoryColor[category as ExpenseCategory] || '';
    }
  };

   const data: ChartData<"pie"> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),

        borderColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),
        borderWidth: 1,
      },
    ],
  };


  const options = {
    maintainAspectRatio: false,
    responsive: true,
  }


  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={selectedType}
            label="収支の種類"
            onChange={handleChange}
          >
            <MenuItem value="income">収入</MenuItem>
            <MenuItem value="expense">支出</MenuItem>
          </Select>
      </FormControl>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoading ? (
          <CircularProgress />
          ) : monthlyTransactions.length > 0 ? (
            <Pie options={options} data={data} />
          ) : (
            <Typography>データがありません</Typography>
          )}
      </Box>
    </>
  )
}

export default CategoryChart
