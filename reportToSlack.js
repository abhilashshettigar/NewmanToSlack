let title
let stats
require('dotenv').config()

const SlackWebhook = require('slack-webhook')
const slack = new SlackWebhook(process.env.SLACK_WEBHOOK_KEY)
var newman = require('./tests/node_modules/newman'); // require('newman')
newman.run({
  collection: require('../tests/RentalQ.postman_collection.json'),
  environment: require('../tests/RentalQ.postman_environment.json'),
  reporters: 'cli'
}).on('start', function (err, args) { // on start of run, log to console
  console.log('running a collection...');
}).on('done', function (err, summary) {
  if (summary.error) {
    console.error('collection run encountered an error.');
  } else {
    data = summary.run.stats
    if (summary.run.failures.length > 0) {
      title = '<!channel> ' + 'Test Summary for APi test cases';
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

    } else {
      console.info('Sucess');
      title = '<!channel> ' + 'Test Summary for APi test cases'

    }

    // title = '<!channel> ' + 'Test Summary for APi test cases'
    // stats = {
    //   "text": {     
    //     "type": "mrkdwn",
    //     "text": '`'+output+'`'
    //   }
    // }

    // console.log(stats);

    console.log('collection run completed.');
    // slack.send({
    //   text: title + stats
    // }).then(function (res) {
    //   console.log(res);

    // }).catch(function (err) {
    //   console.log(err);

    // })
  }
});