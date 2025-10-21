let userSchemas = [];
let jwtToken = '';

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
        console.log('Login response data:', data);
        if (response.ok) {
            jwtToken = data.token;
            userSchemas = data.userSchemas; // Array of schemas from JWT
            console.log('userSchemas:', userSchemas, 'type:', typeof userSchemas, 'isArray:', Array.isArray(userSchemas));
            populateSchemaSelect(userSchemas);
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('schema-selection').style.display = 'block';
        } else {
            alert('Ошибка входа: ' + data.message);
        }
    } catch (error) {
        alert('Ошибка сети: ' + error.message);
    }
});

document.getElementById('select-schema-btn').addEventListener('click', () => {
    const selectedSchema = document.getElementById('schema-select').value;
    if (selectedSchema) {
        loadSalesData(selectedSchema);
    } else {
        alert('Пожалуйста, выберите схему.');
    }
});

function populateSchemaSelect(schemas) {
    console.log('populateSchemaSelect called with schemas:', schemas);
    const select = document.getElementById('schema-select');
    select.innerHTML = '';
    if (!schemas || !Array.isArray(schemas)) {
        console.error('schemas is not an array or is undefined:', schemas);
        return;
    }
    schemas.forEach(schema => {
        const option = document.createElement('option');
        option.value = schema;
        option.textContent = schema.replace(/company(\d+)/, 'Company $1');
        select.appendChild(option);
    });
}



async function loadSalesData(schema) {
    try {
        // Query for table: only dimensions
        const tableQuery = {
            dimensions: ['Sales.id', 'Sales.product_name', 'Sales.quantity', 'Sales.price', 'Sales.sale_date']
        };

        const tableResponse = await fetch(`/cubejs-api/v1/load?tenantId=${schema}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
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

        const chartResponse = await fetch(`/cubejs-api/v1/load?tenantId=${schema}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ query: chartQuery })
        });
        const chartData = await chartResponse.json();

        if (!chartResponse.ok) {
            alert('Ошибка загрузки данных графика: ' + chartData.error);
            return;
        }

        displayTable(tableData.data);
        displayChart(chartData.data);
        const displaySchema = schema.replace(/company(\d+)/, 'Company $1');
        document.getElementById('dashboard-title').textContent = `Статистика продаж - Схема: ${displaySchema}`;
        document.getElementById('schema-selection').style.display = 'none';
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