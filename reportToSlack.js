const rimraf =  require('rimraf')

const path = require('path')

const moment =  require('moment');

const upload = require('./upload.js');

const newman = require('newman');

require('dotenv').config()

const SlackWebhook = require('slack-webhook');
const slack = new SlackWebhook(process.env.SLACK_WEBHOOK_KEY);
let title
let stats

const exportPath = './reports/index-'+moment().format("dddd-MMMM-Do-YYYY-h-mm-ss-a")+'.html';
var res = exportPath.slice(10, 55);
let bucketName = 'testtrtnewman'

let s3ObjectURL = 'https://s3.us-east-2.amazonaws.com/'+bucketName+'/'+res

newman.run({
  collection: require('./tests/RentalQ.Testcases.postman_collection.json'),
  environment: require('./tests/RentalQ.postman_environment.json'),
  reporters:  ['cli', 'htmlextra'],
  reporter: {
    htmlextra: {
        export: exportPath,
        template: './tests/templates/dashboardTemplate.hbs'
    }
  }
}).on('start', function (err, args) { // on start of run, log to console
  console.log('running a collection...');
}).on('done', function (err, summary) {

  if (summary.error) {
    console.error('collection run encountered an error.');
  } else {
    data = summary.run.stats
    if (summary.run.failures.length > 0) {
      title = '<!channel> ' + 'Test Summary for APi test cases' + 'For HTML reports click on link:-'+s3ObjectURL
      var output = []
      
      for (let index = 0; index < summary.run.failures.length; index++) {
        output.push(index+1+'. '+summary.run.failures[index].error.message)
      }
      var temp =JSON.stringify(output)
      result = [
        {
          "type": "section",
          "color": "danger",
          "fields": [
            {
              "title": "No. Of Iterations ",
              "value": data.iterations.total,
              "short": true
            },
            {
              "title": "No. Of Requests ",
              "value": data.requests.total,
              "short": true
            },
            {
               "title": "No. Of Assertions: ",
              "value": data.assertions.total,
              "short": true
            },
            {
              "title": "No. Of Failures",
              "value": 'Request: '+data.requests.failed+' ,'+' Assertions: '+data.assertions.failed,
              "short": true
            },
            {
              "title": "Test Failures ",
              "type": "mrkdwn",
              "value":temp.replace(/[\[\]"]+/g,'').split(',').join('\n')
            }
          ]
        }
      ]
      slack.send({
        text: title,
        attachments: result
      }).then(function (res) {
        console.log(res);

      }).catch(function (err) {
        console.error(err);

      })
    upload.uploadReport()
      console.log('Report Uploaded successfully')
      rimraf(path.join(__dirname, '.', 'reports'), () => {});
    } else {
      console.info('Sucess');
      title = '<!channel> ' + 'Test Summary for APi test cases ' + 'For HTML reports click on link:-' +s3ObjectURL;
      result = [
        {
          "type": "section",
          "color": "good",
          "fields": [
            {
              "title": "No. Of Iterations ",
              "value": data.iterations.total,
              "short": true
            },
            {
              "title": "No. Of Requests ",
              "value": data.requests.total,
              "short": true
            },
            {
               "title": "No. Of Assertions: ",
              "value": data.assertions.total,
              "short": true
            },
            {
              "title": "All test are Passed :thumbsup_all:",
             "short": true
           }
          ]
        }
      ]
      slack.send({
        text: title,
        attachments: result
      }).then(function (res) {
        console.log(res);

      }).catch(function (err) {
        console.error(err);
      })
      upload.uploadReport();
      console.log('Report Uploaded successfully')
      rimraf(path.join(__dirname, '.', 'reports'), () => {});
    }
  }
});
//Get S3 URL from butcket and display URL in Slack
