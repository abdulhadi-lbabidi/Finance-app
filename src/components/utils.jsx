export const formatPrice = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const filterDataByCurrency = (data, currencyId) => {
  return data.filter((data) => data.cur_id.id === currencyId);
};

export const filterDataByMonth = (data, month) => {
  return data.filter((item) => {
    const itemDate = new Date(item.date); // Assuming item.date is in a valid date format
    return itemDate.getMonth() === month; // Month is 0-indexed (0 = January, 11 = December)
  });
};

export const filterDataByCurrencyAndMonth = (datae, month, currencyId) => {
  return datae.filter((data) => {
    const dataDate = new Date(data.date);
    const dataMonth = dataDate.getMonth(); // Months are 0-indexed in JavaScript
    return data.cur_id.id === currencyId && dataMonth === month;
  });
};

export const filterDataByYear = (data, year) => {
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() === year;
  });
};
export const sumValuesByMangerId = (data, manger_id, type) => {
  return data
    .filter((item) => item.manger_id === manger_id && item.type == type) // Filter items by manager_id
    .reduce((total, item) => total + item.amount, 0); // Sum the values
};
export const filterDataByManegerId = (data, manger_id, type) => {
  return data.filter(
    (item) => item.manger_id === manger_id && item.type == type
  ); // Filter items by manager_id
};
