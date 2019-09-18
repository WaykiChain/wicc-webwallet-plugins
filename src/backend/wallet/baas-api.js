import axios from 'axios'
import * as uuidv4 from 'uuid/v4'

const BAAS_TESTNET =  'http://10.0.0.31:21052' // 'https://baas-test.wiccdev.org/v2/api'  //      'https://test.wiccbaas.com/v1/api'
const BAAS_MAINNET = 'https://baas.wiccdev.org/v2/api'

const handleResponse = ({ data }) => {
  if (data.code === 0) {
    return data.data
  } else {
    throw new Error('error from server response: ' + data.msg)
  }
}

const handleError = (error) => {
  throw error
}

export default class {
  constructor(network) {
    this.network = network || 'testnet'
    if (this.network === 'mainnet') {
      this.host = BAAS_MAINNET
    }else if (this.network === 'testnet') {
      this.host = BAAS_TESTNET
    } else { 
      this.host = 'https://baas-test.wiccdev.org/v2/api'
      alert('自定义baas')
    }
  }

  getBlockInfo() {
    return axios.post(this.host + '/block/getinfo').then(handleResponse, handleError)
  }

  getblockcount() {
    return axios.post(this.host + '/block/getblockcount').then(handleResponse, handleError)
  }

  getAccountInfo(address) {
    alert(address)
    return axios.post(this.host + '/account/getaccountinfo',{'address':address}).then(handleResponse, handleError)
  }

  getTxDetail(tx) {
    return axios.post(this.host + '/transaction/gettxdetail', {
      hash: tx,
    }).then(handleResponse, handleError)
  }


  ///这里暂时每更换，还是v1接口
  getTokenInfo(regId, address) {
    return axios.get(this.host + '/contract/get/' + regId + '/' + address)
      .then(handleResponse, handleError)
  }

  submitOfflineTrans(rawtx) {
    let url = this.host + '/transaction/sendtxraw'
    // alert(`${url},${rawtx}`)
    return axios.post(url, {
      rawtx: rawtx,
    }).then(handleResponse, handleError)
  }


  ///获取wicc，wusd，wgrt交易记录
  getTransHistory(info) {
    if (!info.address) throw new Error('address is required.')
    return axios.post(this.host + '/transaction/gettranscationsbyaddress', {
        "address": info.address,
        "currentpage": info.currentpage,
        "pagesize": info.pagesize,
        "startheight": 1,
        "trandirection": 0,
        "txtype": "",
        "coinsymbol":info.coinsymbol,
    }).then(handleResponse, handleError)
  }
  ///获取
  getDetailInfo(info){
    return axios.post(this.host + '/transaction/gettxdetailplus', info).then(handleResponse, handleError)
  }
}
