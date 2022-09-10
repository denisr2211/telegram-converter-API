const express = require('express');
const TelegramApi = require('node-telegram-bot-api');
const Result = require('./modules/models/Classes/Result');
const Currency = require('./modules/models/Classes/Currency.js');
const { convertOptions } = require('./modules/option');
const getApiMono = require('./modules/controllers/api_mono.controllers');
const getApiNbu = require('./modules/controllers/api_nbu.controllers');
const flag = require('./modules/flag');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '5564242028:AAEQ4pR6wUhn5g_nALD6FUm0eCmYsyA32W4';
const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });

const app = express();
const port = process.env.PORT || 8080;


// const startConvert = async (chatId) => {
//     await bot.sendMessage(chatId, `Введи ниже сумму и валюту, из какой и в какую хочешь конвертировать\nНапример: 100 usd uah`);
// }

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/converter', description: 'Конвертация валют' },
    ]);
    try {
        bot.on('message', async (msg) => {

            const text = msg.text;
            const chatId = msg.chat.id;

            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/r/Rich_Uncle/Rich_Uncle_022.webp');
                return bot.sendMessage(chatId, 'Welcome to currency converter!\nSelect "converter" from the menu.');
            }
            if (text === '/converter') {
                return bot.sendMessage(chatId, 'Choose a resource to convert:', convertOptions);
            }
            return bot.sendMessage(chatId, 'I do not understand you, try again!');
        });
    } catch {
        console.log(e.message);
    };

    bot.on('callback_query', async msg => {
        const data = msg.data.split(':');
        const source = data[1];
        const chatId = msg.from.id;

        if (source === 'nbu') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/m/money_stickerex/money_stickerex_016.webp');
            await bot.sendMessage(chatId, 'To convert, enter text in the format:\n100 usd eur');

            bot.on('message', async query => {

                const text = query.text;
                const userMessageData = query.text.toUpperCase();
                let userInputText = userMessageData.split(' ');
                const chatId = query.from.id;

                return conv(chatId, userMessageData, source);
            });
        }
        if (source === 'mono') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/q/qr_cat/qr_cat_034.webp');
            await bot.sendMessage(chatId, 'To convert, enter text in the format:\n100 usd eur')

            bot.on('message', async query => {

                const text = query.text;
                const userMessageData = query.text.toUpperCase();
                let userInputText = userMessageData.split(' ');
                const chatId = query.from.id;

                return conv(chatId, userMessageData, source);
            });
        };
    });
};

async function conv(chatId, userMessageData, source) {

    let result;
    if (source === 'nbu') {
        result = await getApiNbu();
    }
    else {
        result = await getApiMono();
    };

    let curarray = userMessageData.split(' ');
    let amount = curarray[0];
    let currencyFrom = curarray[1];
    let currencyTo = curarray[2];

    const foundCurrencyFrom = result.find((data) => {
        return data.letterCode === currencyFrom;
    });
    const foundCurrencyTo = result.find((data) => {
        return data.letterCode === currencyTo;
    });

    try {
        if (!foundCurrencyFrom || !foundCurrencyTo) {
            return bot.sendMessage(chatId, 'No currency found 2');
        };
        if (curarray.length != 3) {
            return bot.sendMessage(chatId, 'Incorrect input');
        };

        if (foundCurrencyFrom && foundCurrencyTo) {

            let getValue = `
                        ${amount} ${currencyFrom} ${flag[currencyFrom]}
                ⇋ 
                ${(foundCurrencyFrom.getRate() / foundCurrencyTo.getRate() * amount).toFixed(3)} ${currencyTo} ${flag[currencyTo]}
                Source: ${source}
                `;

            return bot.sendMessage(chatId, getValue);
        };
    } catch (e) {
        bot.sendMessage(e);
    };

};

start();