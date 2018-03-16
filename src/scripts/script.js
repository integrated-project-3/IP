/*
  Used to format the ticks returned by the API to readable string.
  Could be done in the lambda before returning the data, however keeping the ticks
  means that the date can be sorted correctly.
*/
function formatDate(ticks) {
  const epochTicks = 621355968000000000;
  const ticksSinceEpoch = ticks - epochTicks;
  const millisecondsSinceEpoch = ticksSinceEpoch / 10000;
  const date = new Date(millisecondsSinceEpoch);
  return date.toLocaleDateString()
}

export {formatDate}
