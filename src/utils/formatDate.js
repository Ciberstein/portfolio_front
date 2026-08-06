const formatDate = (
  date,
  options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }
) => {
  // new Date(null) yields the Unix epoch, not an invalid date, so a missing
  // value would silently render as "Jan 1970". Bail out instead.
  if (!date) return '';

  const OriginalDate = new Date(date);
  return OriginalDate.toLocaleString(
    'en-US',
    options,
  );
};

export default formatDate;
