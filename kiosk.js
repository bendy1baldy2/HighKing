document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылки на основные элементы DOM киоска
    const categoryButtons = document.querySelectorAll('.category-button');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const itemDetailModal = document.getElementById('itemDetailModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemDescription = document.getElementById('modal-item-description');
    const modalItemPrice = document.getElementById('modal-item-price');
    const addToCartButton = document.getElementById('add-to-cart-button');
    const cartItemCount = document.getElementById('cart-item-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.querySelector('.checkout-button');

    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModalButton = document.getElementById('closePaymentModal');
    const paymentAmountSpan = document.getElementById('paymentAmount');
    const payByCardButton = document.getElementById('payByCard');
    const payByCashButton = document.getElementById('payByCash');
    const payByMobileButton = document.getElementById('payByMobile');
    const paymentStatusMessage = document.getElementById('paymentStatusMessage');

    const cancelOrderButton = document.getElementById('cancelOrderButton');

    // Элементы стартового меню
    const startMenuModal = document.getElementById('startMenuModal');
    const startButton = document.getElementById('startButton');

    let cart = []; // Массив для хранения элементов в корзине

    // Инициализируем kioskOrders в localStorage, если его нет
    if (localStorage.getItem('kioskOrders') === null) {
        localStorage.setItem('kioskOrders', JSON.stringify([]));
    }

    // Фиктивные данные для пунктов меню (в реальном приложении это будет поступать из API)
    const menuData = {
        burgers: [
            { id: 'big-mac', name: 'Big Mac®', price: 4.19, desc: 'The iconic burger with two 100% beef patties, Special Sauce, lettuce, cheese, pickles and onions, all sandwiched between a three-piece sesame seed bun.', img: 'https://via.placeholder.com/200x120?text=Big+Mac' },
            { id: 'quarter-pounder', name: 'Quarter Pounder® w/ Cheese', price: 4.49, desc: 'A juicy 100% beef patty, two slices of cheese, onions and pickles, all in a sesame seed bun.', img: 'https://via.placeholder.com/200x120?text=Quarter+Pounder' },
            { id: 'cheeseburger', name: 'Cheeseburger', price: 1.69, desc: 'A classic 100% beef patty, with a slice of cheese, pickles, onions, mustard and ketchup in a soft bun.', img: 'https://via.placeholder.com/200x120?text=Cheeseburger' },
            { id: 'double-cheeseburger', name: 'Double Cheeseburger', price: 2.29, desc: 'Two 100% beef patties, with two slices of cheese, pickles, onions, mustard and ketchup in a soft bun.', img: 'https://via.placeholder.com/200x120?text=Double+Cheeseburger' },
            { id: 'mcplant', name: 'McPlant®', price: 4.39, desc: 'A delicious plant-based burger developed with Beyond Meat®, featuring a vegan patty, vegan cheese, lettuce, tomato, pickles, onion, and vegan sauce.', img: 'https://via.placeholder.com/200x120?text=McPlant' }
        ],
        chicken: [
            { id: 'mc-nuggets-6', name: '6 Chicken McNuggets®', price: 4.29, desc: 'Tender, juicy pieces of 100% chicken breast meat in a crispy tempura batter.', img: 'https://via.placeholder.com/200x120?text=Chicken+McNuggets' },
            { id: 'mc-crispy', name: 'McCrispy®', price: 4.99, desc: 'Crispy 100% chicken breast fillet, topped with cool mayo and lettuce, all in a toasted sourdough-style bun.', img: 'https://via.placeholder.com/200x120?text=McCrispy' },
            { id: 'filet-o-fish', name: 'Filet-O-Fish®', price: 4.19, desc: 'A perfectly cooked fish fillet, tangy tartar sauce, and a half slice of cheese in a steamed bun.', img: 'https://via.placeholder.com/200x120?text=Filet-O-Fish' }
        ],
        sides: [
            { id: 'fries-medium', name: 'Medium Fries', price: 2.09, desc: 'Our world famous fries, crispy and golden.', img: 'https://via.placeholder.com/200x120?text=Fries' },
            { id: 'side-salad', name: 'Side Salad', price: 1.49, desc: 'A refreshing mix of lettuce, tomato, and cucumber.', img: 'https://via.placeholder.com/200x120?text=Side+Salad' },
            { id: 'mozzarella-dippers', name: 'Mozzarella Dippers', price: 2.99, desc: 'Warm and gooey mozzarella cheese in a crispy coating, served with a rich tomato dip.', img: 'https://via.placeholder.com/200x120?text=Mozzarella+Dippers' }
        ],
        drinks: [
            { id: 'coca-cola', name: 'Coca-Cola®', price: 1.79, desc: 'The classic taste of Coca-Cola.', img: 'https://via.placeholder.com/200x120?text=Coca-Cola' },
            { id: 'fanta', name: 'Fanta® Orange', price: 1.79, desc: 'Sparkling orange flavored soft drink.', img: 'https://via.placeholder.com/200x120?text=Fanta' },
            { id: 'sprite', name: 'Sprite®', price: 1.79, desc: 'Lemon-lime flavored soft drink.', img: 'https://via.placeholder.com/200x120?text=Sprite' },
            { id: 'water', name: 'Still Water', price: 1.09, desc: 'Refreshing still water.', img: 'https://via.placeholder.com/200x120?text=Water' }
        ],
        desserts: [
            { id: 'mcflurry-oreo', name: 'Oreo® McFlurry®', price: 1.99, desc: 'Smooth dairy ice cream, swirled with crushed Oreo® pieces.', img: 'https://via.placeholder.com/200x120?text=McFlurry+Oreo' },
            { id: 'apple-pie', name: 'Apple Pie', price: 1.29, desc: 'Warm, crispy crust filled with sweet apples.', img: 'https://via.placeholder.com/200x120?text=Apple+Pie' },
            { id: 'milkshake-chocolate', name: 'Chocolate Milkshake', price: 2.39, desc: 'Thick and creamy chocolate flavored milkshake.', img: 'https://via.placeholder.com/200x120?text=Chocolate+Milkshake' }
        ],
        breakfast: [
            { id: 'sausage-egg-mcmuffin', name: 'Sausage & Egg McMuffin®', price: 3.49, desc: 'A delicious combination of a pork sausage patty, egg, and cheese in a toasted English muffin.', img: 'https://via.placeholder.com/200x120?text=Sausage+Egg+McMuffin' },
            { id: 'bacon-egg-muffin', name: 'Bacon & Egg McMuffin®', price: 3.49, desc: 'Crispy bacon, egg, and cheese in a toasted English muffin.', img: 'https://via.placeholder.com/200x120?text=Bacon+Egg+McMuffin' },
            { id: 'hash-brown', name: 'Hash Brown', price: 1.19, desc: 'Crispy, golden potato hash brown.', img: 'https://via.placeholder.com/200x120?text=Hash+Brown' }
        ],
        happy_meal: [
            { id: 'happy-meal-hamburger', name: 'Hamburger Happy Meal®', price: 3.99, desc: 'A small hamburger, served with a choice of side and drink, and a toy.', img: 'https://via.placeholder.com/200x120?text=Happy+Meal+Hamburger' },
            { id: 'happy-meal-nuggets-4', name: '4 McNuggets Happy Meal®', price: 4.29, desc: 'Four chicken McNuggets, served with a choice of side and drink, and a toy.', img: 'https://via.placeholder.com/200x120?text=Happy+Meal+Nuggets' }
        ]
    };

    // Функция для рендеринга пунктов меню на основе выбранной категории
    function renderMenuItems(category) {
        menuItemsContainer.innerHTML = ''; // Очищаем текущие элементы
        const itemsToDisplay = menuData[category] || []; // Получаем элементы для категории

        if (itemsToDisplay.length === 0) {
            menuItemsContainer.innerHTML = '<p>No items found in this category.</p>';
            return;
        }

        itemsToDisplay.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('menu-item-card');
            itemCard.dataset.itemId = item.id;
            itemCard.dataset.category = category;
            itemCard.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">£${item.price.toFixed(2)}</p>
            `;
            menuItemsContainer.appendChild(itemCard);

            // Добавляем слушатель кликов для открытия модального окна с деталями элемента
            itemCard.addEventListener('click', () => openItemDetailModal(item));
        });
    }

    // Функция для открытия модального окна с деталями элемента
    function openItemDetailModal(item) {
        modalItemImage.src = item.img;
        modalItemImage.alt = item.name;
        modalItemName.textContent = item.name;
        modalItemDescription.textContent = item.desc;
        modalItemPrice.textContent = `£${item.price.toFixed(2)}`;
        addToCartButton.onclick = () => addItemToCart(item); // Устанавливаем действие для добавления в корзину
        itemDetailModal.style.display = 'flex'; // Показываем модальное окно
    }

    // Функция для закрытия модального окна
    function closeItemDetailModal() {
        itemDetailModal.style.display = 'none';
    }

    // Функция для добавления элемента в корзину
    function addItemToCart(item) {
        cart.push(item);
        updateCartSummary();
        closeItemDetailModal(); // Закрываем модальное окно после добавления в корзину
    }

    // Функция для обновления сводки корзины (количество элементов и общая сумма)
    function updateCartSummary() {
        cartItemCount.textContent = cart.length;
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `£${total.toFixed(2)}`;
        // Обновляем текст кнопки оформления заказа с общей суммой, если в корзине есть элементы
        if (cart.length > 0) {
            checkoutButton.textContent = `Review Order & Pay (£${total.toFixed(2)})`;
        } else {
            checkoutButton.textContent = 'Review Order & Pay';
        }
    }

    // Функция для открытия модального окна оплаты
    function openPaymentModal() {
        const currentTotal = cart.reduce((sum, item) => sum + item.price, 0);
        if (currentTotal === 0) {
            paymentStatusMessage.textContent = 'Your cart is empty. Please add items to order.';
            paymentStatusMessage.style.color = 'orange';
            paymentStatusMessage.style.display = 'block';
            payByCardButton.style.display = 'none';
            payByCashButton.style.display = 'none';
            payByMobileButton.style.display = 'none';
            
            const paymentReturnButton = document.createElement('button');
            paymentReturnButton.id = 'paymentReturnButton';
            paymentReturnButton.textContent = 'Return to Menu';
            paymentReturnButton.classList.add('payment-return-button');
            paymentReturnButton.addEventListener('click', resetKioskToStartMenu);
            paymentModal.querySelector('.modal-content').appendChild(paymentReturnButton);
            paymentAmountSpan.textContent = `£0.00`;
        } else {
            paymentAmountSpan.textContent = `£${currentTotal.toFixed(2)}`;
            paymentStatusMessage.style.display = 'none';
            payByCardButton.style.display = 'block';
            payByCashButton.style.display = 'block';
            payByMobileButton.style.display = 'block';
            const existingReturnButton = paymentModal.querySelector('#paymentReturnButton');
            if (existingReturnButton) {
                existingReturnButton.remove();
            }
        }
        paymentModal.style.display = 'flex';
    }

    // Функция для закрытия модального окна оплаты
    function closePaymentModal() {
        paymentModal.style.display = 'none';
        paymentStatusMessage.style.display = 'none';
        const existingReturnButton = paymentModal.querySelector('#paymentReturnButton');
        if (existingReturnButton) {
            existingReturnButton.remove();
        }
        closePaymentModalButton.style.display = 'block';
    }

    // Функция для симуляции оплаты
    function simulatePayment(method) {
        payByCardButton.style.display = 'none';
        payByCashButton.style.display = 'none';
        payByMobileButton.style.display = 'none';
        closePaymentModalButton.style.display = 'none';

        paymentStatusMessage.style.display = 'block';
        paymentStatusMessage.style.color = '#FFD700';
        if (method === 'Card') {
            paymentStatusMessage.textContent = 'Please insert card.';
        } else if (method === 'Cash') {
            paymentStatusMessage.textContent = 'Please insert cash.';
        } else if (method === 'Mobile App') {
            paymentStatusMessage.textContent = 'Please continue payment in Mobile App.';
        }

        setTimeout(() => {
            paymentStatusMessage.textContent = `Payment successful via ${method}! Your order is being prepared.`;
            paymentStatusMessage.style.color = 'green';
            
            // Получаем текущие заказы из localStorage (представляем как orders.json)
            const currentOrders = JSON.parse(localStorage.getItem('kioskOrders') || '[]');
            // Генерируем простой уникальный ID для нового заказа
            const newOrderId = (currentOrders.length > 0) ? Math.max(...currentOrders.map(o => parseInt(o.id))) + 1 : 1001;
            // Форматируем элементы корзины для хранения
            const newOrderItems = cart.map(item => `${item.name} x1`); // Пример: "Big Mac x1"
            currentOrders.push({ id: newOrderId.toString(), items: newOrderItems, status: 'preparing' });
            // Сохраняем обновленные заказы обратно в localStorage
            localStorage.setItem('kioskOrders', JSON.stringify(currentOrders));
            console.log('New order added:', { id: newOrderId.toString(), items: newOrderItems, status: 'preparing' });

            cart = []; // Очищаем корзину после оформления заказа
            updateCartSummary();

            setTimeout(() => {
                closePaymentModal();
                resetKioskToStartMenu(); // Возвращаемся в стартовое меню после успешной оплаты
            }, 1000);
        }, 1500);
    }

    // Функция для отмены текущего заказа и возврата в стартовое меню
    function cancelOrder() {
        cart = [];
        updateCartSummary();
        closeItemDetailModal();
        closePaymentModal();
        resetKioskToStartMenu();
    }

    // --- Функции управления пользовательским интерфейсом киоска ---
    // Функция для отображения основного пользовательского интерфейса киоска
    function showMainKioskUI() {
        startMenuModal.style.display = 'none'; // Скрываем стартовое меню
        document.querySelector('.kiosk-header').style.display = 'flex';
        document.querySelector('.kiosk-main').style.display = 'flex';
        document.querySelector('.kiosk-footer').style.display = 'flex';
        document.body.style.overflow = 'auto'; // Включаем прокрутку
        renderMenuItems('burgers'); // Рендерим бургеры по умолчанию
        updateCartSummary();
    }

    // Функция для сброса киоска в стартовое меню
    function resetKioskToStartMenu() {
        cart = []; // Очищаем корзину
        updateCartSummary(); // Обновляем сводку корзины
        closeItemDetailModal(); // Закрываем модальное окно деталей
        closePaymentModal(); // Закрываем модальное окно оплаты
        
        // Скрываем основные элементы киоска
        document.querySelector('.kiosk-header').style.display = 'none';
        document.querySelector('.kiosk-main').style.display = 'none';
        document.querySelector('.kiosk-footer').style.display = 'none';
        document.body.style.overflow = 'hidden'; // Отключаем прокрутку
        
        startMenuModal.style.display = 'flex'; // Показываем стартовое меню
    }

    // --- Слушатели событий ---

    // При загрузке страницы всегда показываем стартовое меню
    startMenuModal.style.display = 'flex';

    // Слушатель для кнопки "Start Your Order" в стартовом меню
    startButton.addEventListener('click', showMainKioskUI);

    // Слушатели для кнопок категорий
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;
            currentCategoryTitle.textContent = button.textContent;
            renderMenuItems(category);
        });
    });

    // Слушатели для кнопок закрытия модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', closeItemDetailModal);
    });

    // Глобальный слушатель кликов для закрытия модальных окон при клике вне их содержимого.
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            const parentModal = event.target.closest('.modal');
            if (parentModal === itemDetailModal) {
                closeItemDetailModal();
            } else if (parentModal === paymentModal) {
                const statusText = paymentStatusMessage.textContent;
                // Закрываем модальное окно оплаты, только если нет сообщения об успешной оплате или пустой корзине
                if (!statusText.startsWith('Payment successful via') && !statusText.startsWith('Your cart is empty.')) {
                    closePaymentModal();
                }
            }
        }
    });

    // Слушатели для кнопок оформления заказа, оплаты и отмены
    checkoutButton.addEventListener('click', openPaymentModal);
    closePaymentModalButton.addEventListener('click', closePaymentModal);
    payByCardButton.addEventListener('click', () => simulatePayment('Card'));
    payByCashButton.addEventListener('click', () => simulatePayment('Cash'));
    payByMobileButton.addEventListener('click', () => simulatePayment('Mobile App'));
    cancelOrderButton.addEventListener('click', cancelOrder);

    // Initial load/update of cart summary
    updateCartSummary();
});
