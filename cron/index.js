const cron = require('node-cron');
const fs = require('fs');
const { EVERY_30_MINUTES } = require('./scheduleConstants');

// const generateReport = (interval = '') => {
//   if (!fs.existsSync('reports')) {
//     fs.mkdirSync('reports');
//   }

//   const existingReports = fs.readdirSync('reports');
//   const reportsOfType = existingReports?.filter((existingReport) => existingReport.includes(interval));
//   fs.writeFileSync(`reports/${interval}_${new Date().toISOString()}.txt`, `Existing Reports: ${reportsOfType?.length}`);
// };

module.exports.cronTasks = () => {
  // cron.schedule(EVERY_30_SECONDS, () => {
  //   generateReport('thirty-seconds');
  // });
  
  // cron.schedule(EVERY_MINUTE, () => {
  //   generateReport('minute');
  // });
  
  cron.schedule(EVERY_30_MINUTES, () => {
    // generateReport('thirty-minutes');
    if(global.gun_root){
      let rootmap = global.gun_root.split(',');
      if(rootmap.length > 0){
        rootmap.forEach((node)=>{
          global.gun.get(node.trim()).once(console.log);
        });
      }
    }
  });

  // cron.schedule(EVERY_HOUR, () => {
  //   generateReport('hour');
  // });
}