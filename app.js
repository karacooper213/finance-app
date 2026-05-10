


// elements
const app = document.createElement("div");
const balanceEl = document.querySelector("#Balance")
const input = document.createElement("input");
const historyList = document.createElement("ul");
input.type = "number";
input.placeholder = "Enter amount";
input.style.padding = "8px";
const withdrawBtn = document.createElement("button");
withdrawBtn.textContent = "Withdraw";
const depositBtn = document.createElement("button");
depositBtn.textContent = "Deposit";
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

app.append(input, depositBtn, withdrawBtn, historyList);

document.body.append(app);
