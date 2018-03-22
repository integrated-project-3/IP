function formatDate(ticks) {
  const epochTicks = 621355968000000000;
  const ticksSinceEpoch = ticks - epochTicks;
  const millisecondsSinceEpoch = ticksSinceEpoch / 10000;
  const date = new Date(millisecondsSinceEpoch);
  return date.toLocaleDateString()
}

function formatAttachmentTime(dateTime) {
  if (dateTime.length === 16) {
    return dateTime.substring(11,17)
  }
  return "Time not available"
}

export {formatDate, formatAttachmentTime}