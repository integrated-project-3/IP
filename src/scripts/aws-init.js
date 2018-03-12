var aws = require('aws-sdk/dist/aws-sdk-react-native');

const region = 'eu-west-2'
const identityPoolId = 'eu-west-2:08d581de-ebd5-4b08-9a05-a19aadcca3bc'

aws.config.update({region: region})
aws.config.credentials = new aws.CognitoIdentityCredentials({IdentityPoolId: identityPoolId});

var lambda = new aws.Lambda({region: region, apiVersion: '2015-03-31'})

export {lambda}
