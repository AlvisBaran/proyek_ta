// Helper for dates manipulations

// Get Days in Range of 2 dates
export const DaysBetween = (date1, date2) => {
  var Difference_In_Time = date2.getTime() - date1.getTime();
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
}