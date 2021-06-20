const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const API_URL = process.env.API_URL;

async function signature(path, data = {}, method = 'GET') {
    const timestamp = Date.now();
    const signature = crypto.createHash('sha256', API_SECRET)
                        .update(`${querystring.stringify({...data, timestamp})}`)
                        .digest('hex');

    const data = { ...data, signature, timestamp };
    const _querystring = `?${querystring.stringify(data)}`;

    try {
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${_querystring}`,
            headers: { 'X-MBX-APIKEY': API_KEY }
        });
        return result.data;
    }
    catch (err) {
        console.log(err);
    }
}

async function call(path, data, method = 'GET') {
    try {
        const _querystring = data ? `?${querystring.stringify(data)}` : '';
        const result = await axios({
            method,
            url: `${process.env.API_URL}${path}${_querystring}`
        });
        return result.data;
    }
    catch(err){
        console.log(err);
    }
}

async function time() {
    return call('/v3/time');
}

async function depth(symbol = "BTCBRL", limit = 5) {
    return call('/v3/depth', {symbol, limit});
}

async function account(){
    return signature('/v3/account');
}

module.exports = { time, depth , account}