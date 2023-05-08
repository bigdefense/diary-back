export const getWeekRange = (dateStr: string) => {
  const curr = new Date(dateStr);
  const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
  const firstDayStr = `${firstday.getFullYear()}-${
    firstday.getMonth() + 1
  }-${firstday.getDate()}`;
  const lastDayStr = `${lastday.getFullYear()}-${
    lastday.getMonth() + 1
  }-${lastday.getDate()}`;

  return [firstDayStr, lastDayStr];
};

export const getMonthRange = (dateStr: string) => {
  const curr = new Date(dateStr);
  const lastday = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
  const firstdayStr = `${curr.getFullYear()}-${curr.getMonth() + 1}-01`;
  const lastDayStr = `${curr.getFullYear()}-${
    curr.getMonth() + 1
  }-${lastday.getDate()}`;
  return [firstdayStr, lastDayStr];
};

export const getMonthFirstDay = (dateStr: string) => {
  const curr = new Date(dateStr);
  const firstday = new Date(curr.setDate(1));
  const firstDayStr = `${firstday.getFullYear()}-${
    firstday.getMonth() + 1
  }-${firstday.getDate()}`;
  return firstDayStr;
};
