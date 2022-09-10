class Result {

    constructor(amount, type_to, source) {
        
        this.amount = amount;
        this.type_to = (type_to + '').padStart(0, 3);
        this.source = source;
    }

    getAmount() {
        return this.amount;
    }

    getTypeTo() {
        return this.type_to;
    }

    getSourse() {
        return this.source;
    }


    getResult(){
        return {
            result:{
                type: this.type_to,
                amount: +this.amount,
            },
            source: this.source
        }
    }
}

module.exports = Result;