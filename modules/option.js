module.exports = {
    convertOptions: {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'mono bank', callback_data: 'source:mono' }, 
                    { text: 'nbu', callback_data: 'source:nbu' }
                ],
            ]
        }
    }
}