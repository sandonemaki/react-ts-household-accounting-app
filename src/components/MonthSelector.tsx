import { Box, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale'
import React from 'react'

const MonthSelector = () => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
      dateFormats={{ year: 'yyyy' }} // カレンダー内の年一覧のフォーマット
      >
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Button color={'error'} variant='contained'>
          先月
        </Button>
          <DatePicker
          label="年月を選択"
          sx={{mx: 2, background: "white"}}
          views={["year", "month"]}
          format="yyyy/MM"
          slotProps={{ calendarHeader: { format: 'yyyy年MM月' } }}
          />
        <Button color={'primary'} variant='contained'>
          次月
        </Button>
      </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector
