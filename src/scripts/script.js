export function formatDate(ticks) {
  const epochTicks = 621355968000000000;
  const ticksSinceEpoch = ticks - epochTicks;
  const millisecondsSinceEpoch = ticksSinceEpoch / 10000;
  const date = new Date(millisecondsSinceEpoch);
  return date.toLocaleDateString()
}

export function formatEventTime(dateTime) {
  if (dateTime.length === 16 || dateTime.length === 18) {
    return dateTime.substring(11,16)
  }
  return "Time not available"
}

export function formatEventDate(dateTime) {
  if (dateTime.length === 16 || dateTime.length === 18) {
    var day = dateTime.substr(8,2)
    var month = dateTime.substr(5,2)
    var year = dateTime.substr(0,4)
    return day + '/' + month + '/' + year
  }
  return "Date not available"
}

export function validTitle(str) {
  var s = str.replace(/\s/g,'')
  if (s.length >= 5) {
    return true
  }
  return false
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0})
}

function hasLinkedEvent(a) {
  if (a.LinkedTimelineEventIds != null) {
    if (a.LinkedTimelineEventIds[0] != null) {
      return true
    }
  }
  return false
}

export function sortEvents(events) {

  var sortedEvents = events.sort(function(a,b) {
    a = new Date(a.EventDateTime)
    b = new Date(b.EventDateTime)
    return a - b
  })

  var eventsWithLinkedEvents = []

  for (let i = sortedEvents.length-1; i >= 0; i--) {
    if (hasLinkedEvent(sortedEvents[i])) {
      eventsWithLinkedEvents.push(sortedEvents.splice(i,1)[0])
    }
  }

  while (eventsWithLinkedEvents.length != 0) {
    for (let i = eventsWithLinkedEvents.length-1; i >= 0; i--) {
      var index = sortedEvents.map(function(e){if (hasLinkedEvent(e)) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithLinkedEvents[i].Id)+1
      if (index === 0) {
        if (hasLinkedEvent(eventsWithLinkedEvents[i])) {
          index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithLinkedEvents[i].LinkedTimelineEventIds[0])
        } else {
          index = -1
        }
      }
      if (index != -1) {
        var ev = eventsWithLinkedEvents.splice(i,1)[0]
        sortedEvents.splice(index, 0, ev)
      }
    }
  }

  return sortedEvents
}
