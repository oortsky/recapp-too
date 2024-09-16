export const searchPrice = (id, types) => {
  const price = types
    .find(type => type.id == id)
    ?.price.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  return price;
};
