export const endOfToday = () => {
  const now = new Date();
  const end = new Date(now);

  end.setHours(23, 59, 59, 999);

  return end;
};

export const isStrictlyAfterToday = (date: Date) => {
  return date.getTime() > endOfToday().getTime();
};

