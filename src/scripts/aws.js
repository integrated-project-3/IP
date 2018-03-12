var aws = require('aws-sdk/dist/aws-sdk-react-native');

const region = 'eu-west-2'
const identityPoolId = 'eu-west-2:08d581de-ebd5-4b08-9a05-a19aadcca3bc'

aws.config.update({region: region})
aws.config.credentials = new aws.CognitoIdentityCredentials({IdentityPoolId: identityPoolId});

var lambda = new aws.Lambda({region: region, apiVersion: '2015-03-31'})

var resp

function fetch(p, m) {
  var pay = {
    method: m,
    path: p,
    authToken: 'db79d35b-762a-4ec8-b74e-50517a18c724'
  }

  var pullParams = {
    FunctionName: 'Aileron',
    InvocationType: 'RequestResponse',
    LogType: 'None',
    Payload: JSON.stringify(pay)
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
      resp = val
    })
    .catch(
      // Log the rejection reason
      (reason) => {
        return reason
      })
}

function getTimelines() {
  fetch("/Timeline/GetTimelines", "GET")
  return resp
}

export {getTimelines}
