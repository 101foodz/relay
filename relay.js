require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Gun = require('gun')

const port = process.env.PORT ? process.env.PORT : 8080;
const gun_root = process.env.GUN_ROOT ? process.env.GUN_ROOT : undefined;

const app = express();

app.use(cors())
app.use(express.json())

const router = express.Router()
router.get('/', async (req,res) => {
    res.status(200).json({message: 'ok'})
})

if(gun_root){
    router.get(`/${gun_root}`, async (req,res) => {
        let v;
        gun.get('blog').once(out=>{v = out; console.log(out)}).then(()=>{
            try{
                return res.status(200).json({message: v});
            }catch(_){
                return res.status(500).json({message: "Something went wrong. Could not load blog."});
            }
        });
    })
}

app.use('/',router)

app.use('gundb', Gun)

var server = app.listen(port, '0.0.0.0', ()=>{
    console.log('nodes manager started on port ' + port + ' with /gun')
})

function getPeers(){
    let peers = process.env.GUN_PEERS
    try{
        if(peers != null && peers != undefined && peers.length > 0)
            return peers.split(',');
        throw "";
    }catch(_){ return ['']; }
}

console.log('peers:', getPeers())

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

global.gun = gun;                           /// make global to `node --inspect` - debug only