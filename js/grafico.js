// Función para obtener datos del JSON
async function loadData() {
    const response = await fetch('Json/grafico.json'); // Ruta de tu archivo JSON
    const data = await response.json();
    createChart(data);
}

// Función para crear el gráfico
function createChart(data) {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);

    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico de columnas horizontales
        data: {
            labels: labels,
            datasets: [{
                label: 'Valores',
                data: values,
                backgroundColor: ['#007bff', '#000000', '#ffffff', '#007bff'], // Colores personalizados
                borderColor: '#007bff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        }
    });
}

// Cargar los datos al iniciar la página
window.onload = loadData;
