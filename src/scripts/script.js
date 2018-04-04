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

export function sortEvents(events) {
  var eventsWithTime = []
  var eventsWithoutTime = []

  for (let i = 0; i < events.length; i++) {
    if (events[i].EventDateTime.slice(-2) !== 'BA') {
      eventsWithTime.push(events[i])
    } else {
      eventsWithoutTime.push(events[i])
    }
  }

  if (eventsWithTime.length === 0) {
    if (eventsWithoutTime.length > 0) {
      eventsWithTime.push(eventsWithoutTime.splice(0,1)[0])
    }
  }

  var sortedEvents = eventsWithTime.sort(function(a,b) {
    a = new Date(a.EventDateTime)
    b = new Date(b.EventDateTime)
    return a - b
  })

  while (eventsWithoutTime.length != 0) {
    for (var i = eventsWithoutTime.length-1; i >= 0; i--) {
      var index = sortedEvents.map(function(e) {if (e.LinkedTimelineEventIds != null) if(e.LinkedTimelineEventIds[0] != null) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithoutTime[i].Id) +1
      if (index === 0) {
        if (eventsWithoutTime[i].LinkedTimelineEventIds != null) {
          if (eventsWithoutTime[i].LinkedTimelineEventIds[0] != null) {
            index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithoutTime[i].LinkedTimelineEventIds[0])
          } else {
            index = -1
          }
        } else {
          index = -1
        }
      }
      if (index != -1) {
        var ev = eventsWithoutTime.splice(i,1)[0]
        sortedEvents.splice(index, 0, ev)
      }
    }
  }

  return sortedEvents
}
