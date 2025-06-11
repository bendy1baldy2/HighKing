document.addEventListener('DOMContentLoaded', () => {
    const ordersGrid = document.getElementById('ordersGrid');
    const refreshOrdersButton = document.getElementById('refreshOrdersButton');
    // const backToStaffMenuButton = document.getElementById('backToStaffMenuButton'); // Удален по запросу пользователя
    const deleteAllCompletedOrdersButton = document.getElementById('deleteAllCompletedOrdersButton'); // Ссылка на новую кнопку

    // Массив заказов будет заполняться из localStorage
    let orders = [];

    // Функция для рендеринга заказов на экране управления (для персонала)
    function renderOrders() {
        ordersGrid.innerHTML = ''; // Очищаем существующие заказы
        
        if (orders.length === 0) {
            ordersGrid.innerHTML = '<p style="text-align: center; font-size: 1.2em; color: #777; width: 100%;">No orders to display.</p>';
            return;
        }

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');
            orderCard.innerHTML = `
                <h4>Order #${order.id}</h4>
                <p>Status: <span class="order-status ${order.status}">${translateOrderStatus(order.status)}</span></p>
                <ul>
                    ${order.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="order-actions">
                    ${order.status === 'preparing' ? `<button data-order-id="${order.id}" data-status="ready" class="action-button prepare-button">Mark Ready</button>` : ''}
                    ${order.status === 'ready' ? `<button data-order-id="${order.id}" data-status="completed" class="action-button complete-button">Mark Completed</button>` : ''}
                    ${order.status === 'completed' ? `<button data-order-id="${order.id}" data-status="preparing" class="action-button reset-button">Reset to Preparing</button>` : ''}
                    <button data-order-id="${order.id}" class="action-button delete-order-button">Delete Order</button>
                </div>
            `;
            ordersGrid.appendChild(orderCard);
        });

        // Добавляем слушателей событий для кнопок изменения статуса
        ordersGrid.querySelectorAll('.action-button').forEach(button => {
            if (button.classList.contains('delete-order-button')) {
                button.addEventListener('click', (event) => {
                    const orderId = event.target.dataset.orderId;
                    deleteOrder(orderId); // Вызываем новую функцию для индивидуального удаления
                });
            } else {
                button.addEventListener('click', (event) => {
                    const orderId = event.target.dataset.orderId;
                    const newStatus = event.target.dataset.status;
                    updateOrderStatus(orderId, newStatus);
                });
            }
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

    // Функция для обновления статуса заказа
    function updateOrderStatus(orderId, newStatus) {
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            // Для сохранения между страницами, сохраняем заказы в localStorage
            localStorage.setItem('kioskOrders', JSON.stringify(orders));
            renderOrders(); // Перерисовываем для отображения изменений
            console.log(`Order ${orderId} status updated to ${newStatus}`);
        }
    }

    // Функция для удаления одного заказа
    function deleteOrder(orderId) {
        // Подтверждение удалено
        const initialLength = orders.length;
        orders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('kioskOrders', JSON.stringify(orders));
        renderOrders(); // Перерисовываем для отображения изменений
        if (orders.length < initialLength) {
            console.log(`Order ${orderId} deleted.`);
        }
    }

    // Функция для удаления всех выполненных заказов
    function deleteAllCompletedOrders() {
        // Подтверждение удалено
        const initialCount = orders.length;
        orders = orders.filter(order => order.status !== 'completed');
        localStorage.setItem('kioskOrders', JSON.stringify(orders));
        renderOrders(); // Перерисовываем для отображения изменений
        console.log(`Deleted ${initialCount - orders.length} completed orders.`);
    }


    // Загружаем заказы из localStorage при загрузке страницы
    const savedOrders = localStorage.getItem('kioskOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        // Инициализируем фиктивными данными, если сохраненных заказов нет (для демонстрации)
        orders = [
            { id: '1001', items: ['Big Mac x1', 'Medium Fries x1'], status: 'preparing' },
            { id: '1002', items: ['McCrispy x1', 'Coca-Cola x1'], status: 'ready' },
            { id: '1003', items: ['Cheeseburger x2', 'Chocolate Milkshake x1'], status: 'preparing' },
            { id: '1004', items: ['6 Chicken McNuggets x1'], status: 'completed' }
        ];
        localStorage.setItem('kioskOrders', JSON.stringify(orders)); // Сохраняем начальные фиктивные данные
    }


    renderOrders(); // Начальный рендеринг

    // Устанавливаем автоматическое обновление заказов каждые 2 секунды для просмотра персоналом
    setInterval(() => {
        const updatedOrders = localStorage.getItem('kioskOrders');
        if (updatedOrders) {
            const newOrders = JSON.parse(updatedOrders);
            // Обновляем только если есть фактические изменения
            if (JSON.stringify(orders) !== JSON.stringify(newOrders)) {
                orders = newOrders;
                renderOrders();
                console.log('Staff orders page refreshed due to external change.');
            }
        }
    }, 2000); // Обновляем каждые 2 секунды

    // Кнопка "Back to Staff Menu" удалена, поэтому нет слушателя событий.
    // Если пользователь вернется на index.html, скрипт на этой странице обработает повторное открытие меню персонала, если это уместно.

    // Слушатель событий для кнопки "Delete All Completed Orders"
    deleteAllCompletedOrdersButton.addEventListener('click', deleteAllCompletedOrders);
});
