require('dotenv').config()
const CRON = require('./cron')
// const { default: cron } = require('./cron')

const express = require('express')
const cors = require('cors')
const Gun = require('gun')

const port = process.env.PORT ? process.env.PORT : 8080;
const gun_root = process.env.GUN_ROOT ? process.env.GUN_ROOT : undefined;
const root_pub = process.env.GUN_PUB ? process.env.GUN_PUB : undefined;


const app = express();

app.use(cors())
app.use(express.json())

const router = express.Router()
router.get('/', async (req,res) => {
    res.status(200).json({message: 'ok'})
})

/* DYNAMIC ROUTE CREATION */
if(gun_root){
    let rootmap = gun_root.split(',');
    if(rootmap.length > 0){
        try{
            rootmap.forEach((node)=>{
                let rootnode = node.trim();
                router.get(`/root/${rootnode}`, async (req,res) => {
                    let v;
                    gun.get(rootnode).once(out=>{v = out;}).then(()=>{
                        try{
                            return res.status(200).json({message: v});
                        }catch(_){
                            return res.status(500).json({message: `Something went wrong. Could not load ${rootnode}.`});
                        }
                    });
                })
            })
        }catch(_){}
    }
}

app.use('/',router)

app.use('gundb', Gun)

var server = app.listen(port, '0.0.0.0', ()=>{
    console.log('relay started on port ' + port + ' with /gun')
    CRON.cronTasks();
})

function getPeers(){
    let peers = process.env.GUN_PEERS
    try{
        if(peers != null && peers != undefined && peers.length > 0)
            return peers.split(',');
        throw "";
    }catch(_){ return ['']; }
}

const gun = Gun({
    peers: getPeers(),
    web: server,
    file: 'data',
    multicast: false,
    verify: {
        check: function(){
            console.log("peer connected");
            return true;
        }
    }
})

global.gun = gun;
global.gun_root = gun_root;
global.root_pub = root_pub;