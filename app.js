


// elements
const app = document.createElement("div");
const balanceEl = document.querySelector("#Balance")
const input = document.querySelector("#amountInput");
const historyList = document.createElement("ul");
const withdrawBtn = document.querySelector("#withdrawBtn");
const depositBtn = document.querySelector("#depositBtn");
let balance = Number(localStorage.getItem("balance")) || 500;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


// update UI 
function updateUI() {
    balanceEl.textContent = `Balance: $${balance}`;
}

transactions.forEach((text) => {
    const item = document .createElement("li");
    item.textContent = text;
    historyList.appendChild(item);
})
//function to add items
function addTransaction(text) {
    transactions.push(text);
    localStorage.setItem("transactions", JSON.stringify(transactions));
   
    const item = document.createElement("li");
    item.textContent = text;
    historyList.appendChild(item);
}


// withdraw
function withdraw(amount){
    if (amount <= 0){return}
    if (balance >= amount){
        balance -= amount;
       updateUI();
       addTransaction(`- $${amount} Withdraw`)
    } else {
        alert("Not enough Money");
    }
    localStorage.setItem("balance", balance);
    input.value = "";
}

// deposit
function deposit (amount){
    if (amount <= 0 ){return}
    balance += amount;
    updateUI();
    addTransaction(`+ $${amount} Deposit`);
    localStorage.setItem("balance", balance);
    input.value ="";
} 



// event listeners

withdrawBtn.addEventListener("click", () => {
    const amount = Number(input.value);
    withdraw(amount);
})

depositBtn.addEventListener("click", () => {
    const amount = Number(input.value);
    deposit(amount);
} )

updateUI();

app.append(historyList);

document.body.append(app);
