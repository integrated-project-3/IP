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

  // var eventsWithTime = []
  // var eventsWithoutTime = []
  //
  // for (let i = 0; i < events.length; i++) {
  //   if (events[i].EventDateTime.slice(-2) !== 'BA') {
  //     eventsWithTime.push(events[i])
  //   } else {
  //     eventsWithoutTime.push(events[i])
  //   }
  // }
  //
  // if (eventsWithTime.length === 0) {
  //   if (eventsWithoutTime.length > 0) {
  //     eventsWithTime.push(eventsWithoutTime.splice(0,1)[0])
  //   }
  // }
  //
  // var sortedEvents = eventsWithTime.sort(function(a,b) {
  //   a = new Date(a.EventDateTime)
  //   b = new Date(b.EventDateTime)
  //   return a - b
  // })
  //
  // while (eventsWithoutTime.length != 0) {
  //   for (var i = eventsWithoutTime.length-1; i >= 0; i--) {
  //     var index = sortedEvents.map(function(e) {if (e.LinkedTimelineEventIds != null) if(e.LinkedTimelineEventIds[0] != null) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithoutTime[i].Id) +1
  //     if (index === 0) {
  //       if (eventsWithoutTime[i].LinkedTimelineEventIds != null) {
  //         if (eventsWithoutTime[i].LinkedTimelineEventIds[0] != null) {
  //           index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithoutTime[i].LinkedTimelineEventIds[0])
  //         } else {
  //           index = -1
  //         }
  //       } else {
  //         index = -1
  //       }
  //     }
  //     if (index != -1) {
  //       var ev = eventsWithoutTime.splice(i,1)[0]
  //       sortedEvents.splice(index, 0, ev)
  //     }
  //   }
  // }

  var sortedEvents = events.sort(function(a,b) {
    a = new Date(a.EventDateTime)
    b = new Date(b.EventDateTime)
    return a - b
  })

  // var sortedEventIds = []
  //
  // for (var i = sortedEvents.length-1; i >= 0; i--) {
  //   if (!sortedEventIds.includes(sortedEvents[i].Id)) {
  //     if (hasLinkedEvent(sortedEvents[i])) {
  //       var done = false
  //       var newPos = sortedEvents.map(function(e){return e.Id}).indexOf(sortedEvents[i].LinkedTimelineEventIds[0])
  //       while (!done) {
  //         if (newPos != -1) {
  //           if (hasLinkedEvent(sortedEvents[newPos])) {
  //             var n = sortedEvents.map(function(e){return e.Id}).indexOf(sortedEvents[newPos].LinkedTimelineEventIds[0])
  //             if (n != -1) {
  //               newPos = n
  //             } else done = true
  //           } else done = true
  //         } else done = true
  //       }
  //       sortedEventIds.push(sortedEvents[i].Id)
  //       sortedEvents.splice(newPos-1,0,sortedEvents.splice(i,1)[0])
  //       if (i > 0) {
  //         if (sortedEventIds.includes(sortedEvents[i-1].Id)) {
  //           sortedEventIds.splice(sortedEventIds.indexOf(sortedEvents[i-1].Id), 1)
  //         }
  //       }
  //       i = sortedEvents.length-1
  //     }
  //   }
  // }

  // for (var i = 0; i < sortedEvents.length; i++) {
  //   if (hasLinkedEvent(sortedEvents[i])) {
  //     var moveList = []
  //     moveList.push(i)
  //     var newIndex = sortedEvents.map(function(e){return e.Id}).indexOf(sortedEvents[i].LinkedTimelineEventIds[0])
  //     var done = false
  //     // debugger
  //     while (!done) {
  //       if (hasLinkedEvent(sortedEvents[newIndex])) {
  //         moveList.push(newIndex)
  //         newIndex = sortedEvents.map(function(e){return e.Id}).indexOf(sortedEvents[newIndex].LinkedTimelineEventIds[0])
  //       } else {
  //         done = true
  //       }
  //     }
  //     for (var j = moveList.length-1; j >= 0; j--) {
  //     // for (var j = 0; j < moveList.length; j++) {
  //       sortedEvents.splice(newIndex-1,0,sortedEvents.splice(moveList[j], 1)[0])
  //     }
  //   }
  // }

  var eventsWithLinkedEvents = []

  for (var i = sortedEvents.length-1; i >= 0; i--) {
    if (hasLinkedEvent(sortedEvents[i])) {
      eventsWithLinkedEvents.push(sortedEvents.splice(i,1)[0])
    }
  }

  while (eventsWithLinkedEvents.length != 0) {
    for (var i = eventsWithLinkedEvents.length-1; i >= 0; i--) {
      var index = sortedEvents.map(function(e) {if (e.LinkedTimelineEventIds != null) if(e.LinkedTimelineEventIds[0] != null) return e.LinkedTimelineEventIds[0]}).indexOf(eventsWithLinkedEvents[i].Id) +1
      if (index === 0) {
        if (eventsWithLinkedEvents[i].LinkedTimelineEventIds != null) {
          if (eventsWithLinkedEvents[i].LinkedTimelineEventIds[0] != null) {
            index = sortedEvents.map(function(e) {return e.Id}).indexOf(eventsWithLinkedEvents[i].LinkedTimelineEventIds[0])
          } else {
            index = -1
          }
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
