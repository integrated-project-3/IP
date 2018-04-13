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

function getBase64(callback, file) {
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function() {
    callback(reader.result)
  }
  reader.onerror = function(error) {
    console.log(error)
  }
}

function urlToFile(url, filename, mimeType) {
  mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1]
    return (fetch(url)
        .then(function(res){return res.arrayBuffer()})
        .then(function(buf){return new File([buf], filename, {type:mimeType})})
    );
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
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/Create',
    {
    'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
    'TenantId':'Team19',
    'TimelineEventId': GUID(),
    'Title': payload.title,
    'Description': payload.description,
    'EventDateTime': payload.dateTime
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

export function unlinkEventFromTimeline(eventId, timelineId) {
  var put = axios.put('https://gcu.ideagen-development.com/Timeline/UnlinkEvent',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'EventId': eventId,
      'TimelineId': timelineId
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

export function changeEventTitle(id, title) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/EditTitle',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'Title': title,
      'TimelineEventId': id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function changeEventDate(id, dateTime) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/EditEventDateTime',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'EventDateTime': dateTime,
      'TimelineEventId': id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function changeEventDescription(id, description) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEvent/EditDescription',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'Description': description,
      'TimelineEventId': id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function createAttachment(payload) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEventAttachment/Create',
    {
    'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
    'TenantId':'Team19',
    'AttachmentId': GUID(),
    'Title': payload.title,
    'TimelineEventId': payload.eventId
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function deleteAttachment(id) {
  var put = axios.put('https://gcu.ideagen-development.com/TimelineEventAttachment/Delete',
    {
      'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
      'TenantId':'Team19',
      'AttachmentId':id
    }
  ).catch(error => {
    console.log(error)
  })
  return put
}

export function generateUploadURL(id) {
  var get = axios.get('https://gcu.ideagen-development.com/TimelineEventAttachment/GenerateUploadPresignedUrl', {
    headers: {
      'TenantId': 'Team19',
      'AuthToken': '7cbc5c61-bcfa-47d8-a171-599616102147',
      'AttachmentId': id
    }
  }).catch(error => {
    console.log(error)
  })
  return get
}

export function generateGetURL(id) {
  var get = axios.get('https://gcu.ideagen-development.com/TimelineEventAttachment/GenerateGetPresignedUrl', {
    headers: {
      'TenantId': 'Team19',
      'AuthToken': '7cbc5c61-bcfa-47d8-a171-599616102147',
      'AttachmentId': id
    }
  }).catch(error => {
    console.log(error)
  })
  return get
}

export function uploadAttachment(payload) {
  var fileBase64 = ''
  return new Promise(function(resolve, reject) {
    getBase64(function(val) {
      fileBase64 = val
      axios.put(payload.url, fileBase64
      ).then(result => {
        resolve(result)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
    }, payload.file)
  })
}

export function downloadAttachment(filename, url) {
  return new Promise(function(resolve, reject) {
    axios.get(url)
    .then(response => {
      var base64 = response.data
      urlToFile(base64,filename).then(function(file) {
        resolve(file)
      })
    })
    .catch(error => {
      console.log(error)
      reject(error)
    })
  })
}
