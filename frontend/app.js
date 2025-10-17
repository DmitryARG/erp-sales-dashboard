document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const loginForm = document.getElementById('login-form');
    const schemaSelect = document.getElementById('schema-select');
    const salesTable = document.getElementById('sales-table');
    const salesChartCtx = document.getElementById('sales-chart').getContext('2d');
    const logoutBtn = document.getElementById('logout-btn');

    // Жестко закодированный JWT токен (для демонстрации)
    // В реальном приложении токен будет генерироваться на бэкенде после аутентификации
    const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsInNjaGVtYSI6ImNsaWVudDEiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    let salesChart = null;

    // Обработчик формы входа
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Имитация успешного входа без реального запроса на /login
            // Скрыть страницу входа и показать дашборд
            loginPage.classList.add('hidden');
            dashboardPage.classList.remove('hidden');
            
            // Имитация получения доступных схем
            const availableSchemas = ['client1', 'client2'];
            populateSchemaSelect(availableSchemas);
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Ошибка при входе. Попробуйте еще раз.');
        }
    });

    // Функция для заполнения выпадающего списка схем
    function populateSchemaSelect(schemas) {
        schemaSelect.innerHTML = '<option value="">-- Выберите схему --</option>';
        schemas.forEach(schema => {
            const option = document.createElement('option');
            option.value = schema;
            option.textContent = schema;
            schemaSelect.appendChild(option);
        });
    }

    // Обработчик выбора схемы
    schemaSelect.addEventListener('change', function() {
        const selectedSchema = schemaSelect.value;
        if (selectedSchema) {
            loadDashboardData(selectedSchema);
        }
    });

    // Функция для загрузки данных из Cube.js API
    async function loadDashboardData(schema) {
        // Обновляем токен с новой схемой (в реальном приложении токен будет обновляться на бэкенде)
        // Для демонстрации будем использовать один и тот же токен
        const token = hardcodedToken;

        try {
            // Запрос для получения данных для таблицы
            const tableQuery = {
                measures: ['Sales.count', 'Sales.totalAmount'],
                dimensions: ['Sales.date'],
                timeDimensions: [{
                    dimension: 'Sales.date',
                    granularity: 'day',
                    dateRange: ['2023-01-01', '2023-12-31']
                }]
            };

            // Запрос для получения данных для графика
            const chartQuery = {
                measures: ['Sales.totalAmount'],
                dimensions: ['Sales.month'],
                timeDimensions: [{
                    dimension: 'Sales.date',
                    granularity: 'month',
                    dateRange: ['2023-01-01', '2023-12-31']
                }]
            };

            // Выполняем оба запроса параллельно
            const [tableResponse, chartResponse] = await Promise.all([
                fetch('http://46.8.238.87:4000/cubejs-api/v1/load', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ query: tableQuery })
                }),
                fetch('http://46.8.238.87:4000/cubejs-api/v1/load', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ query: chartQuery })
                })
            ]);

            if (tableResponse.ok && chartResponse.ok) {
                const tableData = await tableResponse.json();
                const chartData = await chartResponse.json();

                renderTable(tableData.data);
                renderChart(chartData.data);
            } else {
                console.error('Ошибка при получении данных:', tableResponse.status, chartResponse.status);
                alert('Ошибка при загрузке данных.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            alert('Ошибка при загрузке данных.');
        }
    }

    // Функция для отображения данных в таблице
    function renderTable(data) {
        if (!data || data.length === 0) {
            salesTable.innerHTML = '<p>Нет данных для отображения.</p>';
            return;
        }

        // Создаем заголовки таблицы
        const headers = Object.keys(data[0]);
        let tableHTML = '<table><thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // Создаем строки таблицы
        data.forEach(row => {
            tableHTML += '<tr>';
            headers.forEach(header => {
                tableHTML += `<td>${row[header] || ''}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        salesTable.innerHTML = tableHTML;
    }

    // Функция для отображения данных на графике
    function renderChart(data) {
        if (!data || data.length === 0) {
            if (salesChart) {
                salesChart.destroy();
                salesChart = null;
            }
            return;
        }

        // Уничтожаем предыдущий график, если он существует
        if (salesChart) {
            salesChart.destroy();
        }

        // Подготовим данные для графика
        const labels = data.map(item => item['Sales.month'] || '');
        const values = data.map(item => parseFloat(item['Sales.totalAmount']) || 0);

        // Создаем новый график
        salesChart = new Chart(salesChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Общая сумма продаж',
                    data: values,
                    backgroundColor: 'rgba(51, 51, 0.6)',
                    borderColor: 'rgba(51, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Обработчик кнопки выхода
    logoutBtn.addEventListener('click', function() {
        // Сбросить состояние и вернуться к странице входа
        loginPage.classList.remove('hidden');
        dashboardPage.classList.add('hidden');
        
        // Очистить селект и таблицу
        schemaSelect.innerHTML = '<option value="">-- Выберите схему --</option>';
        salesTable.innerHTML = '';
        
        // Уничтожить график
        if (salesChart) {
            salesChart.destroy();
            salesChart = null;
        }
    });
});