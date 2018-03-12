import {lambda} from './aws-init'

var timelines

function fetchTimelines() {
  var pullParams = {
    FunctionName: 'Aileron-GetTimelines',
    InvocationType: 'RequestResponse',
    LogType: 'None'
  }

  var response = new Promise((resolve, reject) => {
    setTimeout(() => {
      lambda.invoke(pullParams, function(error, data) {
        if (error) {
          console.log(error)
          reject(null)
        } else {
          resolve(JSON.parse(data.Payload))
        }
      })
    }, 2000 )
  })

  response.then(
    // Log the fulfillment value
    function(val) {
      timelines = val
    })
    .catch(
      // Log the rejection reason
      (reason) => {
        return reason
      })
}

function getTimelines() {
  fetchTimelines()
  console.log("123", timelines)
  return timelines
}

export {getTimelines, timelines}
