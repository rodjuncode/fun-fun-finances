// TRY USING THIS WITH QUOKKA.JS ON VISUAL STUDIO CODE

const sum = (sum, l) => sum + l.ammount;

const finance = {
    accounts: [],
    operations: {
        listSum: [],
        listSub: [],
        finance: null,
        list: function() {
            return [...this.listSum.map(l => ({ type: '+', account: l.account, value: l.value })), 
                    ...this.listSub.map(l => ({ type: '-', account: l.account, value: l.value }))]; 
        },
        commit: function(doNotClear) {
            if (this.finance == null) {
                console.log("ERROR: Operations list doesn't have a linked Finance. Run finance._setupOperations()")
            } else {
                for (const o of this.listSum) {
                    this.finance.sum(o.account, o.value);
                }
                for (const o of this.listSub) {
                    this.finance.sub(o.account, o.value);
                }
                if (!doNotClear) this.clear();
            }
        },
        clear: function() {
            this.listSum = [];
            this.listSub = [];
        },
        add: function(type, acc, val) {
            if (type === '+') {
                this.listSum.push({account: acc, value: val});
            } else if (type === '-') {
                this.listSub.push({account: acc, value: val});
            }
        },
        transfer: function(from, to, val) {
            this.add('-', from, val);
            this.add('+', to, val);
        },
    },
    total: function(filter) {
        return this.accounts.filter(filter).reduce(sum, 0.00);
    },
    sum: function(acc, val) {
        if (this.accounts.map(l => l.name).includes(acc)) {
            this.accounts
                .find(l => l.name === acc)
                .ammount += val;
        }
    },
    sub: function(acc, val) {
        this.sum(acc, val*(-1));
    },
    ammountOn: function(acc) {
        return this.accounts.filter(l => acc.includes(l.name)).reduce(sum, 0.00);
    },
    clear: function(acc) {
        this.accounts = this.accounts.map(l => (
            {   name: l.name, 
                type: l.type, 
                ammount: (acc.includes(l.name) ? 0 : l.ammount) 
            }));
    },
    project: function() {
        const bkp = this.accounts.map(l => ({name: l.name, type: l.type, ammount: l.ammount})); 
        this.operations.commit(doNotClear = true);
        const _accounts = this.accounts.map(l => ({name: l.name, type: l.type, ammount: l.ammount}));
        this.accounts = bkp;
        return _accounts;
    },
    add: function(name, type, ammount) {
        if (!this.accounts.map(l => l.name).includes(name))
            this.accounts.push({ name: name, type: type, ammount: (ammount == null ? 0.00 : ammount) });
    },
    init: function() {
        this._setupOperations();
    },
    _setupOperations: function() {
        this.operations.finance = this;
    },
}

// # creating accounts #########################################################################

const ITAU      = 'Conta Corrente (Itaú)';
const RICO      = 'Conta Corrente (Rico)';
const NU        = 'Conta Corrente (NuBank)';
const POUP      = 'Poupança';
const ACOES     = 'Ações';
const TD        = 'Tesouro Direto';
const GRANA     = 'Espécie (R$)';
const DOLAR     = 'Dólar';
const CARRO     = 'Automóvel';
const BITCOIN   = 'Bitcoin';
const PREV      = 'Previdência';

const RENDA_FIXA = 'Renda Fixa';
const RENDA_VARIAVEL = 'Renda Variável'

const _rendaFixa = l => l.type === RENDA_FIXA;
const _rendaVariavel = l => l.type === RENDA_VARIAVEL;
const _total = l => true;
const _investimento = l => !(l.type === null);
const disponivelInvestimento = [ITAU, RICO, GRANA];

finance.init(); 

finance.add(ITAU, null, 0.00);
finance.add(NU, null, 0.00);
finance.add(RICO, null, 0.00);
finance.add(GRANA, null, 0);
finance.add(CARRO, null, 0.00);
finance.add(TD, RENDA_FIXA, 0.00);
finance.add(POUP, RENDA_FIXA, 0.00);
finance.add(PREV, RENDA_FIXA, 0.00);
finance.add(ACOES, RENDA_VARIAVEL, 0.00);
finance.add(DOLAR, RENDA_VARIAVEL, 0); 
finance.add(BITCOIN, RENDA_VARIAVEL, 0.00);

// # ---- examples ######################################################################### 

finance.operations.commit(); // everything before this line is considered history

// future (not commited, but you can use for projections)
finance.operations.add('+', ITAU, 200.00);     // salary

finance.operations.transfer(ITAU, NU, 50.00);   

finance.operations.add('-', NU, 10.00);        // candy
finance.operations.add('-', NU, 30.00);        // beer

finance.operations.transfer(ITAU, TD, 200);   // investing

finance.operations.commit();

// # ---- summary ###################################################################### 

//console.log(finance.accounts); // takes into calculation only commited inputs
console.log(finance.project()); // takes into calculation future inputs

console.log("Total:", finance.total(_total));
console.log("Total investido:", finance.total(_investimento));

console.log("Porcentagem investido renda fixa: ", finance.accounts.filter(_rendaFixa).reduce(sum, 0.00)/finance.total(_investimento)*100);
console.log("Porcentagem investido renda variável: ", finance.accounts.filter(_rendaVariavel).reduce(sum, 0.00)/finance.total(_investimento)*100);
