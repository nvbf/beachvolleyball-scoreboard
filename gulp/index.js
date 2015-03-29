const fs = require('fs');
const  tasks = fs.readdirSync('./gulp/tasks/');

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
