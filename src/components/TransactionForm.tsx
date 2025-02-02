import CloseIcon from "@mui/icons-material/Close";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AddHomeIcon from "@mui/icons-material/AddHome";
import AlarmIcon from "@mui/icons-material/Alarm";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    ListItemIcon,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { ExpenseCategory, IncomeCategory, Transaction } from "../types";
import { Schema, transactionSchema } from "../validations/schema";
import { z } from "zod";
import { set } from "date-fns";



// TransactionFormProps の型定義を修正
interface TransactionFormProps {
    // onCloseForm は関数型であることを明示的に定義
    onCloseForm: () => void;
    isEntryDrawerOpen: boolean;
    currentDay: string;
    onSaveTransaction: (transaction: Schema) => Promise<void>;
    selectedTransaction: Transaction | null;
    onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
    setSlectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
    onUpdateTransaction: (transaction: Schema, transanctionId: string) => Promise<void>;
    isMobile: boolean;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IncomeExpenseType = "income" | "expense";
interface CategoryItem {
    label: IncomeCategory | ExpenseCategory;
    icon: JSX.Element;
}

const TransactionForm = ({
    onCloseForm,
    isEntryDrawerOpen,
    currentDay,
    onSaveTransaction,
    selectedTransaction,
    onDeleteTransaction,
    setSlectedTransaction,
    onUpdateTransaction,
    isMobile,
    isDialogOpen,
    setIsDialogOpen,
}: TransactionFormProps) => {
    const formWidth = 320;

    // 支出用カテゴリ
    const expenseCategories: CategoryItem[] = [
        { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
        { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
        { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
        { label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
        { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
        { label: "交通費", icon: <TrainIcon fontSize="small" /> },
    ];
    // 収入用カテゴリ
    const incomeCategories: CategoryItem[] = [
        { label: "給与", icon: <WorkIcon fontSize="small" /> },
        { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
        { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
    ];

    const [categories, setCategories] = useState(expenseCategories);

    // transactionSchema の型に基づいた型定義
    type TransactionFormData = z.infer<typeof transactionSchema>;

    const {
      control,
      setValue,
      watch,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm<Schema>({
        defaultValues: {
          type: "expense",
          date: currentDay,
          amount: 0,
          category: "",
          content: "",
        },
        resolver: zodResolver(transactionSchema),
    });
    // console.log(errors);

    // 収支切り替え
    const incomExpenseToggle = (type: IncomeExpenseType) => {
        setValue("type", type);
        setValue("category", "");
    };

    // 収支タイプを監視
    const currentType = watch("type");
    // console.log(currentType);

    useEffect(() => {
        const newCategories = currentType === "expense" ? expenseCategories : incomeCategories;
        setCategories(newCategories);
      }, [currentType]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setValue("date", currentDay);
    }, [currentDay]);

    // フォームの送信処理
    const onSubmit:SubmitHandler<Schema> = (data) => {
        // console.log(data);
        if (selectedTransaction) {
          onUpdateTransaction(data, selectedTransaction.id)
          .then(()=> {
            // console.log("更新しました");
            setSlectedTransaction(null);
            setIsDialogOpen(false);
          })
          .catch((error) => {
            console.error("更新エラー:", error);
          });

        } else {
          onSaveTransaction(data)
          .then(() => {
            console.log("保存しました");
            setSlectedTransaction(null);
          })
          .catch((error) => {
            console.error("保存エラー:", error);
          });
        }

        reset({
          type: "expense",
          date: currentDay,
          amount: 0,
          category: "",
          content: "",
        })
    };
    useEffect(() => {
      // 選択肢が更新されたか確認
      if (selectedTransaction) {
        const categoryExists = categories.some(
          (category) => category.label === selectedTransaction.category
        );
        setValue("category", categoryExists ? selectedTransaction.category : "" as Transaction["category"]);
      }
    }, [selectedTransaction, categories]);

    useEffect(() => {
      if (selectedTransaction) {
        setValue("type", selectedTransaction.type);
        setValue("date", selectedTransaction.date);
        setValue("amount", selectedTransaction.amount);
        setValue("content", selectedTransaction.content);
      } else {
        reset ({
          type: "expense",
          date: currentDay,
          amount: 0,
          category: "",
          content: "",
        });
      }
    }, [selectedTransaction]);

    const handleDelete = () => {
      if (selectedTransaction) {
        onDeleteTransaction(selectedTransaction.id);
        if (isMobile) {
          setIsDialogOpen(false);
        }
        setSlectedTransaction(null);
      }
    }

    const formContent = (
      <>
        {/* 入力エリアヘッダー */}
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
            <Typography variant="h6">入力</Typography>
            {/* 閉じるボタン */}
            <IconButton
                onClick={onCloseForm}
                sx={{
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
        </Box>
        {/* フォーム要素 */}
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {/* 収支切り替えボタン */}
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => {
                        return (
                            <ButtonGroup fullWidth>
                                <Button
                                    variant={
                                        field.value === "expense" ? "contained" : "outlined"
                                    }
                                    color="error"
                                    onClick={() => incomExpenseToggle("expense")}
                                >
                                    支出
                                </Button>
                                <Button
                                    variant={
                                        field.value === "income" ? "contained" : "outlined"
                                    }
                                    color={"primary"}
                                    onClick={() => incomExpenseToggle("income")}
                                >
                                    収入
                                </Button>
                            </ButtonGroup>
                        );
                    }}
                />

                {/* 日付 */}
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="日付"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!errors.date}
                            helperText={errors.date?.message}
                        />
                    )}
                />

                {/* カテゴリ */}
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (

                        <FormControl fullWidth error={!!errors.category}>
                          <InputLabel id="category-select-label">カテゴリ</InputLabel>
                            <Select
                              {...field}
                              labelId="category-select-label"
                              id="category-select"
                              label="カテゴリ"
                            >
                              {categories.map((category, index) => (
                                <MenuItem value={category.label} key={index}>
                                  <ListItemIcon>
                                      {category.icon}
                                  </ListItemIcon>
                                  {category.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.category?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />

                {/* 金額 */}
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => {
                    // console.log(field);
                    return (
                      <TextField
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      {...field}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value, 10) || 0;
                        field.onChange(newValue)
                      }}
                      label="金額"
                      type="number"
                      />
                    );
                  }}
                />

                {/* 内容 */}
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <TextField
                        error={!!errors.content}
                        helperText={errors.content?.message}
                        {...field} label="内容" type="text" />
                    )}
                />

                {/* 保存ボタン */}
                <Button
                    type="submit"
                    variant="contained"
                    color={currentType === "income" ? "primary" : "error"}
                    fullWidth
                >
                    {selectedTransaction ? "更新" : "保存"}
                </Button>
                {selectedTransaction && (
                  <Button
                    onClick={handleDelete}
                    variant="outlined"
                    color={"secondary"}
                    fullWidth
              >
                  削除
              </Button>
                )}
            </Stack>
        </Box>
      </>
    )
    return (
      <>
      {isMobile ? (
        // mobile
        <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth={"sm"}>
          <DialogContent>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        // pc
        <Box
        sx={{
            position: "fixed",
            top: 64,
            right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
            width: formWidth,
            height: "100%",
            bgcolor: "background.paper",
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
                theme.transitions.create("right", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            p: 2, // 内部の余白
            boxSizing: "border-box", // ボーダーとパディングをwidthに含める
            boxShadow: "0px 0px 15px -5px #777777",
        }}
        >
        {formContent}
        </Box>
      )}
      </>
    );
};

export default TransactionForm;
