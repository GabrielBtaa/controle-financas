const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('transactions');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

/* DADOS */
let transactions = [];

/* GRÁFICO */
const ctx = document.getElementById('financeChart').getContext('2d');

const financeChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#2ecc71', '#e74c3c'],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

/* FUNÇÕES */
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Preencha todos os campos');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);

  renderTransaction(transaction);
  updateValues();
  updateChart();

  text.value = '';
  amount.value = '';
}

function renderTransaction(transaction) {
  const li = document.createElement('li');
  li.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  li.innerHTML = `
    ${transaction.text}
    <span>R$ ${Math.abs(transaction.amount).toFixed(2)}</span>
  `;

  list.appendChild(li);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter(v => v > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter(v => v < 0).reduce((a, b) => a + b, 0) * -1;

  balance.innerText = `R$ ${total.toFixed(2)}`;
  moneyPlus.innerText = `+ R$ ${income.toFixed(2)}`;
  moneyMinus.innerText = `- R$ ${expense.toFixed(2)}`;
}

function updateChart() {
  const income = transactions
    .filter(t => t.amount > 0)
    .reduce((a, t) => a + t.amount, 0);

  const expense = transactions
    .filter(t => t.amount < 0)
    .reduce((a, t) => a + Math.abs(t.amount), 0);

  financeChart.data.datasets[0].data = [income, expense];
  financeChart.update();
}

/* EVENTO */
form.addEventListener('submit', addTransaction);
