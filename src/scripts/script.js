function formatDate(ticks) {
  const epochTicks = 621355968000000000;
  const ticksSinceEpoch = ticks - epochTicks;
  const millisecondsSinceEpoch = ticksSinceEpoch / 10000;
  const date = new Date(millisecondsSinceEpoch);
  return date.toLocaleDateString()
}

function formatEventTime(dateTime) {
  if (dateTime.length === 16) {
    return dateTime.substring(11,17)
  }
  return "Time not available"
}

function formatEventDate(dateTime) {
  if (dateTime.length === 16) {
    var day = dateTime.substr(8,2)
    var month = dateTime.substr(5,2)
    var year = dateTime.substr(0,4)
    return day + '/' + month + '/' + year
  }
  return "Date not available"
}

function validTitle(str) {
  var s = str.replace(/\s/g,'')
  if (s.length >= 5) {
    return true
  }
  return false
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0})
}

function sortEvents(events) {

  // seperate events into 2 lists, one for events with times, one for the rest.
  // need this for sorting by time.
  var eventsWithTime = events.filter(event => event.EventDateTime != 'n/a')
  var eventsWithoutTime = events.diff(eventsWithTime)
  // events = []

  var sortedEvents = eventsWithTime.sort(function(a,b) {
    a = new Date(a.EventDateTime)
    b = new Date(b.EventDateTime)
    return a - b
  })

  // for (var i = 0; i < eventsWithoutTime.length; i++) {
  //   var index = sortedEvents.map(function(e) {if (e.LinkedTimelineEventIds != null) if(e.LinkedTimelineEventIds[0] != null) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithoutTime[i].Id) +1
  //   if (index === 0) index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithoutTime[i].LinkedTimelineEventIds[0])
  //   sortedEvents.splice(index, 0, eventsWithoutTime[i])
  // }

  // for (var i = 0; i < eventsWithoutTime.length; i++) {
  //   var index = sortedEvents.map(function(e) {if (e.LinkedTimelineEventIds != null) if(e.LinkedTimelineEventIds[0] != null) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithoutTime[i].Id) +1
  //   if (index === 0) {
  //     if (eventsWithoutTime[i].LinkedTimelineEventIds != null) {
  //       if (eventsWithoutTime[i].LinkedTimelineEventIds[0] != null) {
  //         index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithoutTime[i].LinkedTimelineEventIds[0])
  //       } else {
  //         break
  //       }
  //     } else {
  //       break
  //     }
  //   }
  //   // if (index != -1)
  //     sortedEvents.splice(index, 0, eventsWithoutTime[i])
  // }

  // var i = 0
  // while (eventsWithoutTime.length > 0) {
  //   console.log("1: " + i)
  //   console.log("1: " + eventsWithoutTime)
  //   for (var j = 0; j < sortedEvents.length; j++) {
  //     var index = sortedEvents.map(function(e) {if (e.LinkedTimelineEventIds != null) if(e.LinkedTimelineEventIds[0] != null) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithoutTime[i].Id) +1
  //     if (index === 0) {
  //       if (eventsWithoutTime[i].LinkedTimelineEventIds != null) {
  //         if (eventsWithoutTime[i].LinkedTimelineEventIds[0] != null) {
  //           index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithoutTime[i].LinkedTimelineEventIds[0])
  //         }
  //       }
  //     }
  //     if (index != -1) {
  //       sortedEvents.splice(index, 0, eventsWithoutTime.splice(i,1))
  //       break
  //     }
  //   }
  //   // i += 1
  //   console.log("2: " + i)
  //   console.log("2: " + eventsWithoutTime)
  //   // if (i === eventsWithoutTime.length) i = 0
  // }
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

export {formatDate, formatEventTime, formatEventDate, validTitle, sortEvents}
