import axios from 'axios'

export function GUID() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);
}

export function getAll() {
  var get = axios.get('https://gcu.ideagen-development.com/Timeline/GetAllTimelinesAndEvent', {
    headers: {
      'TenantId': 'Team19',
      'AuthToken': '7cbc5c61-bcfa-47d8-a171-599616102147'
    }
  }).catch(error => {
    console.log(error)
  })
  return get
}

export function createTimeline(title) {
  var put = axios.put('https://gcu.ideagen-development.com/Timeline/Create',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'Title': title,
      'TimelineId': GUID()
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function deleteTimeline(id) {
  var put = axios.put('https://gcu.ideagen-development.com/Timeline/Delete',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'TimelineId':id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function changeTimelineTitle(id, title) {
  var put = axios.put('https://gcu.ideagen-development.com/Timeline/EditTitle',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'Title': title,
      'TimelineId': id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function createEvent(payload) {
  var dateTime = payload.dateTime || 'n/a'
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/Create',
    {
    'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
    'TenantId':'Team19',
    'TimelineEventId': GUID(),
    'Title': payload.title,
    'Description': payload.description,
    'EventDateTime': dateTime
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function linkEventToTimeline(eventId, timelineId) {
  var put = axios.put('https://gcu.ideagen-development.com/Timeline/LinkEvent',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'TimelineId': timelineId,
      'EventId': eventId
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function linkEventToEvent(eventId, linkToEventId) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/LinkEvents',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'TimelineEventId': eventId,
      'LinkedToTimelineEventId': linkToEventId
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function unlinkEventFromEvent(eventId, unlinkedFromEventId) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/UnlinkEvents',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'TimelineEventId': eventId,
      'UnlinkedFromTimelineEventId': unlinkedFromEventId
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function deleteEvent(id) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/Delete',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'TimelineEventId':id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}
