import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

// var aws = require('aws-sdk/dist/aws-sdk-react-native');
// const region = 'eu-west-2'
// aws.config.update({region: region})
// aws.config.credentials = new aws.CognitoIdentityCredentials({IdentityPoolId: 'eu-west-2:08d581de-ebd5-4b08-9a05-a19aadcca3bc'});
// var lambda = new aws.Lambda({region: region, apiVersion: '2015-03-31'})
//
// var pullParams = {
//   FunctionName: 'Aileron-GetTimelines',
//   InvocationType: 'RequestResponse',
//   LogType: 'None'
// }
//
// lambda.invoke(pullParams, function(error, data) {
//   var results = ''
//
//   if (error) {
//     console.log(error)
//   } else {
//     results = JSON.parse(data.Payload)
//   }
//
//   console.log(results)
//
// })

new Vue({
  render: h => h(App)
}).$mount('#app')
