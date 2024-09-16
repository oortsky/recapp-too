export const searchIncome = (id, amount, types) => {
  const price = types.find(type => type.id == id)?.price;
  const total = parseInt(amount) * price;
  return total;
};
