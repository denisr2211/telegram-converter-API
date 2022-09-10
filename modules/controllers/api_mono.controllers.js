const cc = require('currency-codes');
const NodeCache = require( 'node-cache' );
const axios = require('axios').default;
const Currency = require('../models/Classes/Currency');
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

let getApi = async function getCurrency() {
    let value = myCache.get('values');
    if (value) {
        console.log('cache found');
        return value;
    }
    let data;
    console.log('cache not found');

    try{
        let response = await axios.get('https://api.monobank.ua/bank/currency');
        data = response.data;
    }
    catch(e){
         console.log(e);
    
    };

    let currencies = [];
    data.forEach(element => {
        elem = cc.number((element.currencyCodeA+'').padStart(3, '0'));
        let rate;
        if (elem){
            if (element.rateBuy){
                rate = element.rateBuy;
            }
            else{
                rate = element.rateCross;
            }
            const c = new Currency(element.currencyCodeA, elem.code, rate);
            currencies.push(c);
        }
    });

    myCache.set('values', currencies, 600);
    
    return currencies;
};

module.exports = getApi;