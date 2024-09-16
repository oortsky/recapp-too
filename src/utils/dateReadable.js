export const dateReadable = str => {
  const date = new Date(str);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  const humanReadableDate = date.toLocaleDateString("id-ID", options);
  return humanReadableDate;
};
