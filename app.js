const TelegramApi = require('node-telegram-bot-api');
const Currency = require('./modules/models/Classes/Currency.js');
const conv = require('./modules/converter')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '5564242028:AAEQ4pR6wUhn5g_nALD6FUm0eCmYsyA32W4';
const bot = new TelegramApi(TELEGRAM_BOT_TOKEN, { polling: true });

const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/converter', description: 'Конвертация валют' },
    ]);

    try {
        bot.on('message', async (msg) => {

            const text = msg.text;
            const chatId = msg.chat.id;
            const result = text.match(/^(\d+) (\w{3}) (\w{3}) (nbu|mono)?/);
            
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/r/Rich_Uncle/Rich_Uncle_022.webp');
                return bot.sendMessage(chatId, 'Welcome to currency converter!\nSelect "converter" from the menu.');
            };
            if (text === '/converter') {
                return bot.sendMessage(chatId, 'Choose a resource to convert,\nenter text in the format:\n100 usd eur mono\nor\n100 usd eur nbu');
            };
            if (result == null || result == undefined || result == NaN) {
                return bot.sendMessage(chatId, 'I do not understand you, try again!\nChoose a resource to convert,\nenter text in the format:\n100 usd eur mono\nor\n100 usd eur nbu');
            }
        });
    } catch (e) {
        console.log(e.message);
    };

    // bot.on('message', async (msg) => {
        
    //     const chatId = msg.from.id;
    //     const str = msg.text;
    //     const result = str.match(/^(\d+) (\w{3}) (\w{3}) (nbu|mono)?/);

    //     if (result == null || result == undefined || result == NaN) {
    //         return bot.sendMessage(chatId, 'I do not understand you, try again!\nChoose a resource to convert,\nenter text in the format:\n100 usd eur mono\nor\n100 usd eur nbu');
    //     }
    // })


    bot.onText(/^(\d+) (\w{3}) (\w{3}) (nbu|mono)?/, async function (context) {
        
        let matches = context.text.match(/^(\d+) (\w{3}) (\w{3}) (nbu|mono)?/);
        let stiker;

        const chatId = context.chat.id;
        const source = matches[4];
        const userMessageData = matches[0];
        // const amount = matches[1];

        try {
            if (source === 'nbu' || source === 'mono') {
                if (source === 'nbu') {
                    stiker = 'https://chpic.su/_data/stickers/m/money_stickerex/money_stickerex_016.webp';
                } else if (source === 'mono') {
                    stiker = 'https://chpic.su/_data/stickers/m/money_stickerex/money_stickerex_017.webp';
                };
                await bot.sendSticker(chatId, stiker);
                const res = await conv(chatId, userMessageData, source)
                return bot.sendMessage(chatId, res);
            }
            // else if (source != 'nbu' || source != 'mono') {
            //     return bot.sendMessage(chatId, 'Important!\nSpecify the exchange source:\n"nbu" or "mono"');
            // }
            return bot.sendMessage(chatId, 'I do not understand you, try again!\nChoose a resource to convert,\nenter text in the format:\n100 usd eur mono\nor\n100 usd eur nbu');
        }
        catch (e) {
            console.log(e.message);
        };
    });
};

start();