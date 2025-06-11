document.addEventListener('DOMContentLoaded', () => {
    const customerOrdersGrid = document.getElementById('customerOrdersGrid');

    // Массив заказов будет заполняться из localStorage
    let orders = [];

    // Функция для рендеринга заказов на экране клиента
    function renderCustomerOrders() {
        customerOrdersGrid.innerHTML = ''; // Очищаем существующие заказы
        // Фильтруем заказы, чтобы показать только "preparing" и "ready"
        const ordersToDisplay = orders.filter(order => order.status === 'preparing' || order.status === 'ready');

        if (ordersToDisplay.length === 0) {
            customerOrdersGrid.innerHTML = '<p style="text-align: center; font-size: 1.2em; color: #777;">No active orders to display.</p>';
            return;
        }

        ordersToDisplay.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('customer-order-card');
            orderCard.innerHTML = `
                <h4>Order #${order.id}</h4>
                <p>Status: <span class="order-status ${order.status}">${translateOrderStatus(order.status)}</span></p>
                <ul>
                    ${order.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            customerOrdersGrid.appendChild(orderCard);
        });
    }

    // Функция для перевода статуса заказа на английский
    function translateOrderStatus(status) {
        switch (status) {
            case 'preparing': return 'Preparing';
            case 'ready': return 'Ready';
            case 'completed': return 'Completed';
            default: return status;
        }
    }

    // Загружаем заказы из localStorage при загрузке страницы
    // Важно: страница клиента должна читать из того же хранилища, куда пишет персонал
    const savedOrders = localStorage.getItem('kioskOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }

    renderCustomerOrders(); // Изначальный рендеринг заказов для клиента

    // Устанавливаем автоматическое обновление заказов каждые 2 секунды
    setInterval(() => {
        const updatedOrders = localStorage.getItem('kioskOrders');
        if (updatedOrders) {
            // Обновляем только если есть фактические изменения, чтобы предотвратить ненужный перерендер
            const newOrders = JSON.parse(updatedOrders);
            if (JSON.stringify(orders) !== JSON.stringify(newOrders)) {
                orders = newOrders;
                renderCustomerOrders();
                console.log('Customer orders page refreshed.');
            }
        }
    }, 2000); // Обновляем каждые 2 секунды
});
