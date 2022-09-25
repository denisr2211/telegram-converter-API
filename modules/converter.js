const Currency = require('./models/Classes/Currency');
const getApiMono = require('./controllers/api_mono.controllers');
const getApiNbu = require('./controllers/api_nbu.controllers');
const flag = require('./flag');

let conv = async function converter(chatId, userMessageData, source) {
    let result;

    if (source === 'nbu') {
        result = await getApiNbu();
    }
    else {
        result = await getApiMono();
    };

    let curarray = userMessageData.split(' ');
    let amount = curarray[0];
    let currencyFrom = curarray[1].toUpperCase();
    let currencyTo = curarray[2].toUpperCase();

    const foundCurrencyFrom = result.find((data) => {
        return data.letterCode === currencyFrom;
    });
    const foundCurrencyTo = result.find((data) => {
        return data.letterCode === currencyTo;
    });
    // console.log({cu})
    console.log(foundCurrencyFrom.getLetterCode())
    console.log(foundCurrencyTo.getLetterCode())

    try {
        if (!foundCurrencyFrom || !foundCurrencyTo) {
            return bot.sendMessage(chatId, 'No currency found');
        };
        if (curarray.length != 4 || foundCurrencyFrom === undefined || foundCurrencyTo === undefined) {
            return bot.sendMessage(chatId, 'Incorrect input');
        };

        if (foundCurrencyFrom && foundCurrencyTo) {

            let getValue = `${amount} ${currencyFrom} ${flag[currencyFrom]}
⇋ 
${(foundCurrencyFrom.getRate() / foundCurrencyTo.getRate() * amount).toFixed(3)} ${currencyTo} ${flag[currencyTo]}
Source: ${source}`;

            return getValue;
        };
    } catch (e) {
        return e;
    };
};

module.exports = conv;