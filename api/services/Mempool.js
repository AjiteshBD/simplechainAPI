const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const RequestObjValidate = require('../services/RequestObjValidate');

const TimeoutRequestTime = 5 * 60 * 1000;
const TimeoutMempoolValidTime = 30 * 60 * 1000;
 //let arr =[];
 let mempool =[];
class Mempool {

    constructor() {
      console.log('Mempool:::::::::::::');
    //this.mempool = [];
    this.timeoutRequests = [];
    this.mempoolValid = [];
    this.timeoutMempoolValid = [];

  }

  addRequesttoValidation(req) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.searchReqByWalletAddress(req.walletAddress).then((result) => {
        console.log(`1::` + result);
        if (result) {
          console.log(`2::` + result);
          resolve(result);
        } else {
          mempool.push(req);
          self.timeoutRequests[req.walletAddress] = setTimeout(function() {
            self.removeValidationReq(req.walletAddress);
          }, TimeoutRequestTime);
          resolve(req);
        }
      }).catch((err) => {
        console.log("Error :: " + err);
        reject(err);
      })
    });

  }


  searchReqByWalletAddress(address) {
    let self = this;
    return new Promise((resolve, reject) => {
      mempool.forEach((req) => {
        if (req.walletAddress == address) {
          console.log('8::'+req.walletAddress);
          console.log('9::'+address);
          let timeElapse = (new Date().getTime().toString().slice(0, -3)) - req.requestTimeStamp;
          let timeLeft = (TimeoutRequestTime / 1000) - timeElapse;
          req.validationWindow = timeLeft;
          resolve(req);
        }
      });
      resolve(undefined);
    });
  }

  async searchByWalletAddress(address) {
    let result =null;
      mempool.forEach((req) => {
        if (req.walletAddress == address) {
          console.log('8::'+req.walletAddress);
          console.log('9::'+address);
          result= req;          
        }
      });
      return result;


  }


  removeValidationReq(address) {
    try {
      let index = 0;
      mempool.forEach((req) => {
        if (req.walletAddress = address) {
          mempool.splice(index, 1);
        }
      });
      index++;
    } catch (e) {
      this.timeoutRequests[address] = null;
      console.log('ERROR ::' + e);
    }
}

  validateReqByWallet(address, signature) {
  let self = this;
  return new Promise((resolve, reject) => {
    self.searchReqByWalletAddress(address).then((result) => {
      console.log('3::'+result.message);
      if (result) {
        let isValid = bitcoinMessage.verify(result.message, address, signature);
          console.log('4::'+isValid);
        let reqObjValidate = new RequestObjValidate.RequestObjValidate(result, isValid);
        if (isValid) {
          let timeElapse = (new Date().getTime().toString().slice(0, -3) - reqObjValidate.status.requestTimeStamp);
          let timeleft = (TimeoutMempoolValidTime / 1000) - timeElapse;
          reqObjValidate.status.validationWindow = timeleft;
          self.mempoolValid.push(reqObjValidate);
          self.timeoutMempoolValid[reqObjValidate.status.address] = setTimeout(function() {
            self.removeValidationReq(reqObjValidate.status.address);
          }, TimeoutMempoolValidTime);
        }
        resolve(reqObjValidate);
      } else {
        resolve(undefined);
      }
    }).catch((err) => {
      console.log("Error::!" + err);
    })
  });
}


// getMempool()
// {
//   let self = this;
//
//
//     self.mempool.forEach((req)=>{
//        arr.push(req);
//     })
//
//
//
//    console.log(arr);
//    return arr;
// }

}



module.exports.Mempool = Mempool;
