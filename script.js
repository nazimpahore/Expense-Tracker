  // DOM Elements
        const balanceElement = document.getElementById('balance');
        const incomeElement = document.getElementById('income');
        const expenseElement = document.getElementById('expense');
        const transactionsList = document.getElementById('transactions-list');
        const transactionForm = document.getElementById('transaction-form');
        const resetBtn = document.getElementById('reset-btn');
        const chartCanvas = document.getElementById('chart');

        // Initialize transactions array
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        // Set current date as default
        document.getElementById('date').valueAsDate = new Date();

        // Initialize chart
        const chart = new Chart(chartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#2ecc71', '#e74c3c'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.parsed.toFixed(2)}`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(amount);
        }

        // Update balance, income, and expense
        function updateSummary() {
            const amounts = transactions.map(transaction =>
                transaction.type === 'income' ? transaction.amount : -transaction.amount
            );

            const balance = amounts.reduce((acc, item) => (acc += item), 0);
            const income = amounts
                .filter(item => item > 0)
                .reduce((acc, item) => (acc += item), 0);
            const expense = amounts
                .filter(item => item < 0)
                .reduce((acc, item) => (acc += item), 0) * -1;

            balanceElement.textContent = formatCurrency(balance);
            incomeElement.textContent = formatCurrency(income);
            expenseElement.textContent = formatCurrency(expense);

            // Update chart
            chart.data.datasets[0].data = [income, expense];
            chart.update();
        }

        // Add transaction to DOM
        function addTransactionDOM(transaction) {
            const sign = transaction.type === 'income' ? '+' : '-';
            const item = document.createElement('div');
            item.classList.add('transaction-item', transaction.type);

            const categoryIcons = {
                salary: 'fa-money-bill',
                freelance: 'fa-laptop',
                investment: 'fa-chart-line',
                food: 'fa-utensils',
                shopping: 'fa-shopping-bag',
                transport: 'fa-car',
                entertainment: 'fa-film',
                utilities: 'fa-bolt',
                health: 'fa-heartbeat',
                other: 'fa-question-circle'
            };

            item.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-icon">
                        <i class="fas ${categoryIcons[transaction.category] || 'fa-question-circle'}"></i>
                    </div>
                    <div class="transaction-details">
                        <h3>${transaction.title}</h3>
                        <p>${transaction.date} • ${transaction.category}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    ${sign}${formatCurrency(transaction.amount)}
                </div>
                <button class="delete-btn" data-id="${transaction.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            transactionsList.insertBefore(item, transactionsList.firstChild);
        }

        // Update transactions list
        function updateTransactionsList() {
            // Clear list
            transactionsList.innerHTML = '';

            // Add transactions
            transactions.slice().reverse().forEach(addTransactionDOM);

            // Update summary
            updateSummary();
        }

        // Generate random ID
        function generateID() {
            return Math.floor(Math.random() * 1000000000);
        }

        // Add new transaction
        function addTransaction(e) {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.querySelector('.radio-option.selected').dataset.type;
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;

            if (!title || !amount || !type || !category || !date) {
                alert('Please fill all fields');
                return;
            }

            const transaction = {
                id: generateID(),
                title,
                amount,
                type,
                category,
                date: new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            };

            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // Add to DOM
            addTransactionDOM(transaction);

            // Update summary
            updateSummary();

            // Reset form
            transactionForm.reset();
            document.getElementById('date').valueAsDate = new Date();

            // Reset radio buttons
            document.querySelectorAll('.radio-option').forEach(option => {
                option.classList.remove('selected');
            });
        }

        // Delete transaction
        function deleteTransaction(id) {
            transactions = transactions.filter(transaction => transaction.id !== id);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            updateTransactionsList();
        }

        // Reset data
        function resetData() {
            if (confirm('Are you sure you want to reset all data?')) {
                transactions = [];
                localStorage.removeItem('transactions');
                updateTransactionsList();
            }
        }

        // Event listeners
        transactionForm.addEventListener('submit', addTransaction);

        resetBtn.addEventListener('click', resetData);

        // Radio button selection
        document.querySelectorAll('.radio-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.radio-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        // Delete transaction event delegation
        transactionsList.addEventListener('click', e => {
            if (e.target.closest('.delete-btn')) {
                const id = parseInt(e.target.closest('.delete-btn').dataset.id);
                deleteTransaction(id);
            }
        });

        // Initialize the app
        function init() {
            updateTransactionsList();
        }

        // Initialize on load
        init();