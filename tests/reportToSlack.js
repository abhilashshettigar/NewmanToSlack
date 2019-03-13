
// const fs = require('fs')

// const report = fs.readFileSync('./test-output.json', 'utf-8')

// let result
// let tests
// let failures
let title
let stats

// const data = JSON.parse(report)

// if (data.failures.length) {
//   console.log(data.stats)
//   failures = data.failures
//   title = '<!channel> ' + 'Failing test(s) for Rental-Q Dashboard for ' + data.suites[0].title
//   stats = '\n:syringe:'+'Total Tests:'+data.stats.tests+'\n:heavy_check_mark:'+'Passes:'+data.stats.passes+'\n:x:'+'Fails:'+data.stats.failures



//   result = failures.map((failure) => {
//     return {
//       "title": "Rental q Dashboard Api test case for: " + data.suites[0].title,
//       "pretext": "============================================================",
//       "color": "danger",
//       "text": ":x: *Error:* " + failure.title +"\n",
//       "fields": [
//         {
//           "title": "Error Stack",
//           "value": failure.err.message,
//           "short": false
//         }
//       ]
//     }
//   })
// } else {
//   title = 'Health check for Rental-Q Dashboard'+ data.suites[0].title
//   stats = '\n:syringe:'+'Total Tests:'+data.stats.tests+'\n:heavy_check_mark:'+'Passes:'+data.stats.passes+'\n:x:'+'Fails:'+data.stats.failures
//   result = [
//     {
//       "fallback": "Test summary",
//       "color": "good",
//       "text": ":white_check_mark: All tests pass!"
//     }
//   ]
// }
require('dotenv').config()

const SlackWebhook = require('slack-webhook')
const slack = new SlackWebhook(process.env.SLACK_WEBHOOK_KEY)
var Table = require('cli-table');
var newman = require('../tests/node_modules/newman'); // require('newman')
newman.run({
  collection: require('../tests/sample.postman_collection.json'),
  environment: require('../tests/RentalQ.postman_environment.json'),
  // reporters: 'json'
}).on('start', function (err, args) { // on start of run, log to console
  console.log('running a collection...');
}).on('done', function (err, summary) {
  if (summary.error) {
    console.error('collection run encountered an error.');
    console.log(summary.error)
    //
  }
  else {
    data = summary.run.stats
    parsed = JSON.stringify(data)

    const table = new Table({
      head: ['', 'Executed', 'failed']
      , colWidths: [20, 10, 10]
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    table.push(
      ['iterations', data.iterations.total, data.iterations.failed]
      , ['requests', data.requests.total, data.requests.failed]
    );

    output = table.toString()
    console.log(output);

    title = '<!channel> ' + 'Test Summary for APi test cases'
    stats = {
      "text": {     
        "type": "mrkdwn",
        "text": '`'+output+'`'
      }
    }

    console.log(stats);
    
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

