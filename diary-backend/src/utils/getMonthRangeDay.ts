export const getMonthRangeDate = (date: string) => {
  const currDate = new Date(date);
  const currMonth = currDate.getMonth() + 2;
  const currYear = currDate.getFullYear();
  const lastDate = new Date(currYear, currMonth, 0);
  const lastDateString = `${lastDate.getFullYear()}-${lastDate.getMonth()}-${lastDate.getDate()}`;
  const firstDateString = `${lastDate.getFullYear()}-${lastDate.getMonth()}-${1}`;
  return [firstDateString, lastDateString];
};
