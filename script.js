// var requestURL = 'https://api.exchangerate.host/symbols'; 
// var request = new XMLHttpRequest(); 
// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();

// request.onload = function() {
//   var response = request.response;
//   console.log(response);
// }

// var requestURL = 'https://api.exchangerate.host/convert?from=USD&to=EUR'; 
// var request = new XMLHttpRequest(); 
// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();

// request.onload = function() {
//   var response = request.response;
//   console.log(response);
// }

// FETCHING DATA USING ASYNC-AWAIT from ApI endpoint
const getCurrencyOptions = async() => {
    const optionsUrl = 'https://api.exchangerate.host/symbols';
    
    const response = await fetch(optionsUrl);
    const json = await response.json();
    
    return json.symbols;
}

// getCurrencyOptions().then(console.log)

// fetching the currency rates(convert endpoint result) data from API endpoint
const getCurrencyRate = async(fromCurrency, toCurrency) => {
    const currencyConvertUrl = new URL('https://api.exchangerate.host/convert')

    currencyConvertUrl.searchParams.append('from', fromCurrency);
    currencyConvertUrl.searchParams.append('to', toCurrency);

    const response = await fetch(currencyConvertUrl);
    const json = await response.json();

    return json.result;
}

// this function will create new option element and create it for the selct element being pass as an arguemnt
const appendOptionsElToSelectEl = (selectEl, optionItem) => {
    const optionEl = document.createElement('option');
    optionEl.value = optionItem.code;
    optionEl.textContent = optionItem.description;
    // optionEl.textContent = optionItem.code;

    selectEl.appendChild(optionEl);
};

const populateSelectEl = (selectEl, optionList) => {
    optionList.forEach( optionItem => {
        appendOptionsElToSelectEl(selectEl, optionItem)
    });
};

// set up and make reference to DOM elements
const setupCurrencies = async() => {
    const fromCurrency = document.querySelector('#fromCurrency');
    const toCurrency = document.querySelector('#toCurrency');
    
    const currencyOptions = await getCurrencyOptions();
    const currencies = Object.keys(currencyOptions).map(currencyKeys => currencyOptions[currencyKeys])

    // populate the select element using the previous fn
    populateSelectEl(fromCurrency, currencies)
    populateSelectEl(toCurrency, currencies)
}


// fn to create the event listener to convert
const setupEventListener = () => {
    const formEl = document.getElementById('converterForm');
    formEl.addEventListener('submit', async event => {
        event.preventDefault();
        const fromCurrency = document.querySelector('#fromCurrency')
        const toCurrency = document.querySelector('#toCurrency')
        const amount = document.querySelector('#amount')
        const convertResultEl = document.querySelector('#result')

        try{
            const rate = await getCurrencyRate(fromCurrency.value, toCurrency.value);
            const amountValue = Number(amount.value);
            const conversionRate = Number(amountValue * rate).toFixed(2);
            convertResultEl.textContent = `${amountValue} ${fromCurrency.value} = ${conversionRate} ${toCurrency.value}`;

        } catch(err) {
            convertResultEl.textContent = `There is an error fetching data[${err.message}]`
            convertResultEl.classList.add('error');
        }
    })
}


setupCurrencies();
setupEventListener();