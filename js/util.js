const getQueryValue = (key) => {
  const url = location.href;

  const queryString = url.split("?").length === 2 ? url.split("?")[1] : null;
  if (!queryString) return null;

  const queries = queryString.split("&");
  const query = queries.find(query => query.split("=")[0] === key);

  return query && query.split("=").length === 2 ? query.split("=")[1] : null;
}

const addQuery = (key, value) => {
  if (location.href.indexOf("?") !== -1)
    location.href = `${location.href}&${key}=${value}`;
  else
    location.href = `${location.href}?${key}=${value}`;
}