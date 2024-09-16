export const searchName = (id, types) => {
  const name = types.find(type => type.id == id)?.name;
  return name;
};
