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
        populateTableSelect();
        document.getElementById('table-select').style.display = 'block';
        document.getElementById('select-table-btn').style.display = 'block';
        document.getElementById('select-schema-btn').style.display = 'none';
    } else {
        alert('Пожалуйста, выберите схему.');
    }
});

document.getElementById('select-table-btn').addEventListener('click', () => {
    const selectedSchema = document.getElementById('schema-select').value;
    const selectedTable = document.getElementById('table-select').value;
    if (selectedTable) {
        loadData(selectedSchema, selectedTable);
    } else {
        alert('Пожалуйста, выберите таблицу.');
    }
});

function populateTableSelect() {
    const select = document.getElementById('table-select');
    select.innerHTML = '';
    const tables = ['Sales', 'MartIncomingGoods'];
    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table;
        option.textContent = table;
        select.appendChild(option);
    });
}

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



async function loadData(schema, table) {
    try {
        let tableQuery, chartQuery, tableDimensions, chartMeasures, chartDimensions;

        if (table === 'Sales') {
            tableDimensions = ['Sales.id', 'Sales.product_name', 'Sales.quantity', 'Sales.price', 'Sales.sale_date'];
            chartMeasures = ['Sales.total'];
            chartDimensions = ['Sales.sale_date'];
        } else if (table === 'MartIncomingGoods') {
            tableDimensions = ['MartIncomingGoods.incoming_good_key', 'MartIncomingGoods.incoming_code', 'MartIncomingGoods.date_key', 'MartIncomingGoods.warehouse_key', 'MartIncomingGoods.product_key', 'MartIncomingGoods.status', 'MartIncomingGoods.creation_date', 'MartIncomingGoods.shipment_type', 'MartIncomingGoods.marketplace_key'];
            chartMeasures = ['MartIncomingGoods.total_quantity'];
            chartDimensions = ['MartIncomingGoods.date_key'];
        }

        // Query for table: only dimensions
        tableQuery = { dimensions: tableDimensions };

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

        // Query for chart: measures total by date
        chartQuery = {
            measures: chartMeasures,
            dimensions: chartDimensions
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

        displayTable(tableData.data, table);
        displayChart(chartData.data, table);
        const displaySchema = schema.replace(/company(\d+)/, 'Company $1');
        document.getElementById('dashboard-title').textContent = `Статистика - Схема: ${displaySchema}, Таблица: ${table}`;
        document.getElementById('schema-selection').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } catch (error) {
        alert('Ошибка сети: ' + error.message);
    }
}

function displayTable(data, table) {
    const tbody = document.querySelector('#sales-table tbody');
    const thead = document.querySelector('#sales-table thead tr');
    tbody.innerHTML = '';

    if (data.length === 0) return;

    // Get column names from the first row
    const columns = Object.keys(data[0]);

    // Update table headers
    thead.innerHTML = '';
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.split('.').pop(); // Remove table prefix
        thead.appendChild(th);
    });

    // Populate table rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function displayChart(data, table) {
    const ctx = document.getElementById('sales-chart').getContext('2d');

    let labels, totals, labelText, xTitle, yTitle;

    if (table === 'Sales') {
        labels = data.map(item => item['Sales.sale_date']);
        totals = data.map(item => item['Sales.total']);
        labelText = 'Общая сумма продаж';
        xTitle = 'Дата продажи';
        yTitle = 'Сумма';
    } else if (table === 'MartIncomingGoods') {
        labels = data.map(item => item['MartIncomingGoods.date_key']);
        totals = data.map(item => item['MartIncomingGoods.total_quantity']);
        labelText = 'Общее количество поступлений';
        xTitle = 'Дата поступления';
        yTitle = 'Количество';
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: labelText,
                data: totals,
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { display: true, title: { display: true, text: xTitle } },
                y: { display: true, title: { display: true, text: yTitle } }
            }
        }
    });
}