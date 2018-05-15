const config = require('../../config.js');
const encode = require('nodejs-base64-encode');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getTodoSummary(){
  const baseAuth = encode.encode(`${config.SF_UNAME}@${config.SF_COMP_ID}:${config.SF_PASSWD}`, 'base64');
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  //setting request method
  //API endpoint for API sandbox
  xhr.open("GET", "https://sandbox.api.sap.com/successfactors/odata/v2/Todo", false);

  //adding request headers
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  //API Key for API Sandbox
  xhr.setRequestHeader("APIKey", `${config.API_HUB_KEY}`);

  //Basic Auth : provide username:password in Base64 encoded in Authorization header
  console.log(`BASIC ${baseAuth}`)
   xhr.setRequestHeader("Authorization", `Basic ${baseAuth}`);

  //sending request
  console.log('Sending DATA')
  xhr.send();
  //console.log(xhr.responseText)
  var data = JSON.parse(xhr.responseText);
  //console.log(data.d.results[2].todos.results.length);
  return data.d.results[2].todos.results.length;
  console.log('Receiving DATA')
}
module.exports = getTodoSummary;
