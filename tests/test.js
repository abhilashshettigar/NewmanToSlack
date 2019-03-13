var newman = require('../node_modules/newman'); // require('newman')
newman.run({
    collection: require('../tests/sample.postman_collection.json'),
    environment: require('../tests/RentalQ.postman_environment.json'),
    reporters: 'cli'
}).on('start', function (err, args) { // on start of run, log to console
    console.log('running a collection...');
}).on('done', function (err, summary) {
    if (err || summary.error) {
        console.error('collection run encountered an error.');
    }
    else {
        console.log(summary.run.stats);
        
        console.log('collection run completed.');
    }
});