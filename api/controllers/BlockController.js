/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Block = require('../services/Block.js');
 const BlockChainClass = require('../services/simpleChain.js');


let blockchain = new BlockChainClass.Blockchain();
module.exports = {


  getBlockByIndex(req,res){
    let id = req.param('index');
    console.log(`id =========`+id);
    blockchain.getBlock(id).then((block) => {
      return res.json(block);
    }).catch((err) => {
      return res.notFound();
    });
 },

async  postNewBlock(req,res){
    let body = req.param('body');
    if (!body) {
      return res.badRequest("Invalid block body!");
    }
    try{
    let newBlock  = new Block.Block(body);

    await blockchain.addBlock(newBlock);
    let height = await blockchain.getBlockHeight();
    blockchain.getBlock(height).then((block) => {
        return res.json(block);
      }).catch((err) => {
        return res.notFound();
      });
    }catch(err)
    {
      return res.notFound();
    }

  }


};
