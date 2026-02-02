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
  const OriginalDate = new Date(date);
  return OriginalDate.toLocaleString(
    'en-US',
    options,
  );
};

export default formatDate;
