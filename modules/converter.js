const Currency = require('./models/Classes/Currency');
const Result = require('./models/Classes/Result');
const cc = require('currency-codes');
const apiMono = require('./controllers/api_mono.controllers');
const apiNbu = require('./controllers/api_nbu.controllers');
const UndefinedCurrency = require('./models/Classes/Error');



function getSummResult(data, amount, clientCurCodeFrom, clientCurCodeTo, source) {
    
    const currencyFrom = cc.code(clientCurCodeFrom);
    const currencyTo = cc.code(clientCurCodeTo);

    if (currencyTo == undefined){
        throw new UndefinedCurrency('Currency not found', clientCurCodeTo);
    }
    
    if (currencyFrom == undefined){
        throw new UndefinedCurrency('Currency not found', clientCurCodeFrom);
    }
    
    const foundCurrencyFrom = data.find((cur) => {
        return cur.getCode().toString() === currencyFrom.number;
    });

    const foundCurrencyTo = data.find((cur) => {
        return cur.getCode().toString() === currencyTo.number;
    });

    let summ = (amount * foundCurrencyFrom.getRate() / foundCurrencyTo.getRate()).toFixed(2);
    return new Result(summ, foundCurrencyTo.getLetterCode(), source);
}


module.exports = async function (amount, clientCurCodeFrom, clientCurCodeTo, source) {

    if (source !== 'mono' && source !== 'nbu') { 
        throw new Error ('Invalid sourse');
    }

    let data;

    if (source === 'mono' ) {
        data = await apiMono();
    }

    else if (source === 'nbu') {
        data = await apiNbu();
    }

    return getSummResult(data, amount, clientCurCodeFrom, clientCurCodeTo, source);


};