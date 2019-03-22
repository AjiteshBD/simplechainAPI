/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Block = require('../services/Block.js');
const BlockChainClass = require('../services/simpleChain.js');
const Mempool = require('../services/Mempool.js');
const hex2ascii =  require('hex2ascii');

let blockchain = new BlockChainClass.Blockchain();
let mempool = new Mempool.Mempool();

module.exports = {


  getBlockByIndex(req,res){
    let id = req.param('index');
    console.log(`id =========`+id);
    blockchain.getBlock(id).then((block) => {
      if(block.body.star)
      {
       block.body.star.storyDecoded =hex2ascii(block.body.star.story);
      }
      return res.json(block);
    }).catch((err) => {
      return res.notFound();
    });
 },

 getBlockByHash(req,res){
   let id = req.param('hash');
   console.log(`id =========`+id);
   blockchain.getBlockByHash(id).then((block) => {
     console.log("controller::"+block);
      if(block.body.star)
      {
       block.body.star.storyDecoded =hex2ascii(block.body.star.story);
      }
     return res.json(block);
   }).catch((err) => {
     return res.notFound();
   });
},

getBlockByAddress(req,res){
  let id = req.param('address');
  console.log(`add =========`+id);
  blockchain.getBlockByAddress(id).then((block) => {
    if(block.body.star)
    {
      block.body.star.storyDecoded =hex2ascii(block.body.star.story);
    }
    return res.json(block);
  }).catch((err) => {
    return res.notFound();
  });
},

async postNewBlock(req, res) {
  let newBlock = null;
  if (req.body.address && req.body.star) {
    let result = await mempool.searchByWalletAddress(req.body.address);
    console.log('RRR::' + result);
    if (result) {
      let RA = req.body.star.ra;
      let DEC = req.body.star.dec;
      let MAG = req.body.star.mag;
      let CEN = req.body.star.cen;
      let starStory = req.body.star.story;
      console.log(starStory);
      if (RA && DEC) {
        console.log("In RA" + RA);
        let body = {
          address: req.body.address,
          star: {
            ra: RA,
            dec: DEC,
            mag: MAG,
            cen: CEN,
            story: Buffer(starStory).toString('hex')
          }
        };
        newBlock = new Block.Block(body);
        console.log("In " + newBlock);
        if (newBlock != null) {
          try {
            console.log("NewBlock::" + newBlock);
            mempool.removeValidationReq(req.body.address);
            await blockchain.addBlock(newBlock);
            let height = await blockchain.getBlockHeight();
            console.log('height::' + height);
            blockchain.getBlock(height).then((block) => {
            block.body.star.storyDecoded =hex2ascii(block.body.star.story);
              return res.json(block);
            }).catch((err) => {
              return res.notFound();
            });
          } catch (err) {
            return res.notFound();
          }
        }
      }
    } else {
      return res.send("address cannot be found!");
    }
  } else {
    return res.send("Check body Parameter!");
  }



}


};
