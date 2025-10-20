let userSchema = '';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        const data = await response.json();
        if (response.ok) {
            userSchema = data.user_schema;
            showSchemaSelection();
        } else {
            alert('Ошибка входа: ' + data.message);
        }
    } catch (error) {
        alert('Ошибка сети: ' + error.message);
    }
});

function showSchemaSelection() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('schema-container').style.display = 'block';

    const select = document.getElementById('schema-select');
    select.innerHTML = '';
    const option = document.createElement('option');
    option.value = userSchema;
    option.textContent = userSchema;
    select.appendChild(option);
}

document.getElementById('select-schema').addEventListener('click', () => {
    const selectedSchema = document.getElementById('schema-select').value;
    loadSalesData(selectedSchema);
});

async function loadSalesData(schema) {
    try {
        // Query for table: only dimensions
        const tableQuery = {
            dimensions: ['Sales.id', 'Sales.product_name', 'Sales.quantity', 'Sales.price', 'Sales.sale_date']
        };

        const tableResponse = await fetch('/cubejs-api/v1/load?schema=' + encodeURIComponent(schema), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: tableQuery })
        });
        const tableData = await tableResponse.json();

        if (!tableResponse.ok) {
            alert('Ошибка загрузки данных таблицы: ' + tableData.error);
            return;
        }

        // Query for chart: measures total by sale_date
        const chartQuery = {
            measures: ['Sales.total'],
            dimensions: ['Sales.sale_date']
        };

        const chartResponse = await fetch('/cubejs-api/v1/load?schema=' + encodeURIComponent(schema), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: chartQuery })
        });
        const chartData = await chartResponse.json();

        if (!chartResponse.ok) {
            alert('Ошибка загрузки данных графика: ' + chartData.error);
            return;
        }

        displayTable(tableData.data);
        displayChart(chartData.data);
        document.getElementById('schema-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } catch (error) {
        alert('Ошибка сети: ' + error.message);
    }
}

function displayTable(sales) {
    const tbody = document.querySelector('#sales-table tbody');
    tbody.innerHTML = '';
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale['Sales.id']}</td>
            <td>${sale['Sales.product_name']}</td>
            <td>${sale['Sales.quantity']}</td>
            <td>${sale['Sales.price']}</td>
            <td>${sale['Sales.sale_date']}</td>
        `;
        tbody.appendChild(row);
    });
}

function displayChart(sales) {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    const labels = sales.map(sale => sale['Sales.sale_date']);
    const totals = sales.map(sale => sale['Sales.total']);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Общая сумма продаж',
                data: totals,
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: 'Дата продажи' } },
                y: { display: true, title: { display: true, text: 'Сумма' } }
            }
        }
    });
}