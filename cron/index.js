const cron = require('node-cron');
const fs = require('fs');
var needle = require('needle');
const { EVERY_5_SECONDS, EVERY_30_SECONDS, EVERY_30_MINUTES } = require('./scheduleConstants');

const PUBLEN = 87;

const generateReport = (interval = '') => {
  if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports');
  }

  const existingReports = fs.readdirSync('reports');
  const reportsOfType = existingReports?.filter((existingReport) => existingReport.includes(interval));
  fs.writeFileSync(`reports/${interval}_${new Date().toISOString()}.txt`, `Existing Reports: ${reportsOfType?.length}`);
};

function getData(pub){
  // console.log('getData()')
  if(global.gun_root){
    let rootmap = global.gun_root.split(',');
    if(rootmap.length > 0){
      rootmap.forEach((node)=>{
        global.gun.get(node.trim()).get(`~${pub}`).once(v=>{
          if(v != null || v != undefined){
            global.gun.get(node.trim()).get('publish').map().once();
          }
        });
      });
    }
  }
}

async function fetchPub(){
  try{
    // console.log('fetchPub()')
    if(global.settings_uri != null && global.settings_uri != undefined && global.settings_uri.length > 0){
      let uri = global.settings_uri;
      const res = await needle('get', uri)
      // console.log('status',res.headers);
      
      if(res){
        const data = await res.body;
        // console.log(`fetch '${uri}'`)
        let pub = (JSON.parse(data)).pub.trim();
        return pub;
      }
    }else{ throw ''}

  }catch(err){
    generateReport(`cron, fetchPub, err`);
    // console.log(err)
  }
}

const gunTask = () => {
  if(global.root_pub){
    if(global.root_pub.length == PUBLEN){
      getData(global.root_pub);
    }
  }else{
    fetchPub().then(root_pub=>{
      if(root_pub.length == PUBLEN){
        getData(root_pub);
      }        
    })
  }
}

module.exports.cronTasks = () => {
  /* 
  cron.schedule(EVERY_5_SECONDS, () => {
    // generateReport(EVERY_5_SECONDS);
    gunTask();
  });
  */

  /*
  cron.schedule(EVERY_MINUTE, () => {
    generateReport('minute');
  });
  */

  cron.schedule(EVERY_30_MINUTES, () => {
    // generateReport('thirty-minutes');
    gunTask();
  });

  /*
  cron.schedule(EVERY_HOUR, () => {
    generateReport('hour');
  });
  */
}