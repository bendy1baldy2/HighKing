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
    const addToCartButton = document.getElementById('add-to-cart-button'); // Исправлено на add-to-cart-button
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

    const startMenuModal = document.getElementById('startMenuModal');
    const startButton = document.getElementById('startButton');
    const kioskHeader = document.querySelector('.kiosk-header');
    const kioskMain = document.querySelector('.kiosk-main');
    const kioskFooter = document.querySelector('.kiosk-footer');

    const cancelOrderButton = document.getElementById('cancelOrderButton');

    // Элементы, связанные с персоналом, теперь в index.html
    const globalStaffAccessButtonContainer = document.getElementById('globalStaffAccessButtonContainer');
    const staffLoginButton = document.getElementById('staffLoginButton');
    const staffLoginModal = document.getElementById('staffLoginModal');
    const closeStaffLoginModal = document.getElementById('closeStaffLoginModal');
    const staffCodeInput = document.getElementById('staffCodeInput');
    const keypadButtons = staffLoginModal.querySelectorAll('.keypad button');
    const staffLoginMessage = document.getElementById('staffLoginMessage');
    
    const staffMenuContainer = document.getElementById('staffMenuContainer'); // Контейнер меню персонала
    const manageOrdersButton = document.getElementById('manageOrdersButton');
    const viewCustomerOrdersButton = document.getElementById('viewCustomerOrdersButton');
    const closeKioskButton = document.getElementById('closeKioskButton');
    const openKioskButton = document.getElementById('openKioskButton');
    const restartSystemButton = document.getElementById('restartSystemButton');
    const logoutStaffButton = document.getElementById('logoutStaffButton');
    const staffMessage = document.getElementById('staffMessage'); // Для сообщений персоналу

    const kioskClosedMessage = document.getElementById('kioskClosedMessage'); // Сообщение о закрытии киоска

    // Данные для входа персонала
    const STAFF_ACCOUNTS = {
        '1234': 'basic', // Может только открывать/закрывать киоск
        '4321': 'admin'  // Имеет доступ ко всем опциям
    };
    let currentStaffRole = localStorage.getItem('currentStaffRole') || null; // Хранит роль вошедшего персонала
    let isKioskClosed = localStorage.getItem('isKioskClosed') === 'true'; // Статус закрытия киоска

    const systemSelectionModal = document.getElementById('systemSelectionModal');
    const systemOptions = systemSelectionModal.querySelectorAll('.system-option');
    const systemSelectionCountdown = document.getElementById('systemSelectionCountdown');
    let selectedSystemIndex = 0;
    let countdownInterval;
    let autoBootTimeout;

    // Элементы HighDesktop
    const highDesktopModal = document.getElementById('highDesktopModal');
    const desktopIconHighKing = highDesktopModal.querySelector('.desktop-icon[data-app="highking-kiosk"]');
    // desktopIconStaffLogin удален из HTML по запросу пользователя.
    const startButtonDesktop = document.getElementById('startButtonDesktop');
    const desktopTime = document.getElementById('desktopTime');
    const startMenu = document.getElementById('startMenu');
    const startMenuItems = startMenu.querySelectorAll('.start-menu-item');
    let desktopTimeInterval; // Переменная для хранения интервала времени рабочего стола

    // Элементы модального окна настроек
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const syncTouchScreenButton = document.getElementById('syncTouchScreenButton');

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
            // Кнопка возврата к оплате появится здесь, так как это сценарий пустой корзины.
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
                resetKioskToStartMenu();
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
        startMenuModal.style.display = 'none';
        staffLoginModal.style.display = 'none'; // Скрываем вход для персонала
        staffMenuContainer.style.display = 'none'; // Скрываем меню персонала
        kioskClosedMessage.style.display = 'none'; // Скрываем сообщение о закрытии киоска
        systemSelectionModal.style.display = 'none'; // Убедитесь, что выбор системы скрыт
        highDesktopModal.style.display = 'none'; // Убедитесь, что HighDesktop скрыт
        settingsModal.style.display = 'none'; // Убедитесь, что настройки скрыты

        kioskHeader.style.display = 'flex';
        kioskMain.style.display = 'flex';
        kioskFooter.style.display = 'flex';
        document.body.style.overflow = 'auto';
        renderMenuItems('burgers');
        globalStaffAccessButtonContainer.style.display = 'block'; // Убедитесь, что кнопка персонала видна
    }

    // Функция для сброса киоска в стартовое меню (основная точка входа)
    function resetKioskToStartMenu() {
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        staffLoginModal.style.display = 'none';
        staffMenuContainer.style.display = 'none';
        kioskClosedMessage.style.display = 'none';
        systemSelectionModal.style.display = 'none'; // Убедитесь, что выбор системы скрыт
        highDesktopModal.style.display = 'none'; // Убедитесь, что HighDesktop скрыт
        settingsModal.style.display = 'none'; // Убедитесь, что настройки скрыты

        startMenuModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        cart = [];
        updateCartSummary();
        closeItemDetailModal();
        closePaymentModal();
        globalStaffAccessButtonContainer.style.display = 'block'; // Убедитесь, что кнопка персонала видна

        // Проверяем, был ли киоск закрыт персоналом, и отображаем соответствующее сообщение
        if (localStorage.getItem('isKioskClosed') === 'true') {
            showKioskClosedMessage();
        }
    }

    // Функция для отображения сообщения о закрытии киоска
    function showKioskClosedMessage() {
        startMenuModal.style.display = 'none';
        staffLoginModal.style.display = 'none';
        staffMenuContainer.style.display = 'none';
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        systemSelectionModal.style.display = 'none';
        highDesktopModal.style.display = 'none';
        settingsModal.style.display = 'none';
        kioskClosedMessage.style.display = 'flex';
        globalStaffAccessButtonContainer.style.display = 'block'; // Оставляем кнопку персонала видимой
    }

    // --- Функциональность выбора системы ---
    function showSystemSelection() {
        // Скрываем все остальные модальные окна
        startMenuModal.style.display = 'none';
        staffLoginModal.style.display = 'none';
        staffMenuContainer.style.display = 'none';
        kioskClosedMessage.style.display = 'none';
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        highDesktopModal.style.display = 'none'; // Убедитесь, что HighDesktop скрыт
        settingsModal.style.display = 'none'; // Убедитесь, что настройки скрыты

        systemSelectionModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        globalStaffAccessButtonContainer.style.display = 'block'; // Кнопка персонала видна на экране выбора

        // Сбрасываем активное состояние и устанавливаем выбор по умолчанию
        systemOptions.forEach((option, index) => {
            option.classList.remove('active');
            if (index === 0) {
                option.classList.add('active'); // HighKing Kiosk по умолчанию
            }
        });
        selectedSystemIndex = 0; // По умолчанию HighKing Kiosk

        // Запускаем отсчет для автоматической загрузки
        startAutoBootCountdown();
    }

    function startAutoBootCountdown() {
        clearInterval(countdownInterval); // Очищаем любой существующий интервал
        clearTimeout(autoBootTimeout); // Очищаем любой существующий тайм-аут

        let timeLeft = 5;
        const updateCountdownText = () => {
            const selectedSystemName = systemOptions[selectedSystemIndex].textContent;
            if (selectedSystemIndex === 0) { // HighKing Kiosk (автозагрузка по умолчанию)
                systemSelectionCountdown.textContent = `Booting ${selectedSystemName} in ${timeLeft}...`;
            } else { // HighDesktop или HighBIOS - нет автозагрузки, если не нажата Enter
                systemSelectionCountdown.textContent = `Press Enter to load ${selectedSystemName}.`;
            }
        };

        updateCountdownText(); // Первое обновление текста

        countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0 && selectedSystemIndex === 0) { // Отсчет только если выбран HighKing Kiosk
                updateCountdownText();
            } else {
                clearInterval(countdownInterval);
                if (selectedSystemIndex === 0) { // Если это был HighKing Kiosk и время вышло
                    systemSelectionCountdown.textContent = `Booting HighKing Kiosk...`;
                    loadSystem(systemOptions[0].dataset.system); // Автозагрузка по умолчанию
                }
            }
        }, 1000);

        // Этот тайм-аут гарантирует, что HighKing Kiosk по умолчанию загрузится через 5 секунд,
        // если нет взаимодействия и это выбранная система.
        autoBootTimeout = setTimeout(() => {
            if (selectedSystemIndex === 0) { // Автозагрузка только если выбран HighKing Kiosk
                loadSystem(systemOptions[0].dataset.system);
            }
        }, 5000);
    }


    function loadSystem(systemType) {
        clearInterval(countdownInterval);
        clearTimeout(autoBootTimeout);
        systemSelectionModal.style.display = 'none'; // Скрываем модальное окно выбора

        if (systemType === 'kiosk') {
            resetKioskToStartMenu(); // Переход к основному стартовому меню киоска
        } else if (systemType === 'highdesktop') {
            openDesktopLoginModal(); // NEW: desktop requires a login
        }
        else if (systemType === 'highbios') {
            simulateHighBiosErrorAndReboot();
        }
    }

    function simulateHighBiosErrorAndReboot() {
        const errorMessageContainer = document.createElement('div');
        errorMessageContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            color: red;
            font-family: 'Courier New', monospace;
            font-size: 2em;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        errorMessageContainer.innerHTML = `
            <div>
                <p>Unable to load HighBIOS Menu!</p>
                <p id="rebootCountdown">Rebooting in 5...!</p>
            </div>
        `;
        document.body.appendChild(errorMessageContainer);

        let rebootTime = 5;
        const rebootCountdownElement = document.getElementById('rebootCountdown');

        const rebootInterval = setInterval(() => {
            rebootTime--;
            if (rebootTime > 0) {
                rebootCountdownElement.textContent = `Rebooting in ${rebootTime}...`;
            } else {
                clearInterval(rebootInterval);
                document.body.removeChild(errorMessageContainer); // Удаляем экран ошибки
                showSystemSelection(); // Перезапускаем систему, переходя к выбору системы
            }
        }, 1000);
    }

    // --- Функциональность HighDesktop ---
    function showHighDesktop() {
        // Скрываем все остальные основные элементы пользовательского интерфейса
        startMenuModal.style.display = 'none';
        staffLoginModal.style.display = 'none';
        staffMenuContainer.style.display = 'none';
        kioskClosedMessage.style.display = 'none';
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        systemSelectionModal.style.display = 'none';
        settingsModal.style.display = 'none'; // Убедитесь, что настройки скрыты

        highDesktopModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        globalStaffAccessButtonContainer.style.display = 'none'; // Кнопка входа персонала скрыта на рабочем столе

        // Очищаем любой существующий интервал перед установкой нового
        if (desktopTimeInterval) {
            clearInterval(desktopTimeInterval);
        }
        updateDesktopTime(); // Первое обновление времени
        desktopTimeInterval = setInterval(updateDesktopTime, 1000); // Обновляем время каждую секунду
    }

    function updateDesktopTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        desktopTime.textContent = `${hours}:${minutes}`;
    }

    // Переключение меню "Пуск"
    function toggleStartMenu() {
        if (startMenu.style.display === 'flex') {
            startMenu.style.display = 'none';
        } else {
            startMenu.style.display = 'flex';
        }
    }

    // Обработка запуска приложений с рабочего стола/меню "Пуск"
    function launchDesktopApp(appName) {
        console.log(`Launching ${appName}...`);
        startMenu.style.display = 'none'; // Закрываем меню "Пуск", если оно открыто
        if (appName === 'highking-kiosk') {
            // При запуске киоска с рабочего стола, убедитесь, что он открыт
            isKioskClosed = false;
            localStorage.setItem('isKioskClosed', 'false'); // Сохраняем состояние
            showMainKioskUI(); // Переход к основному пользовательскому интерфейсу киоска
        } else if (appName === 'settings') {
            showSettingsModal(); // Открываем новое модальное окно настроек
        } else if (appName === 'desktop-logout') { // Выход с рабочего стола
            const logoutMessage = document.createElement('div');
            logoutMessage.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                color: white;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 3em;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                text-align: center;
            `;
            logoutMessage.textContent = 'Logging out from Desktop...';
            document.body.appendChild(logoutMessage);

            setTimeout(() => {
                document.body.removeChild(logoutMessage);
                showSystemSelection(); // Возвращаемся к выбору системы
            }, 1000); // Симулируем выход в течение 1 секунды
        } else if (appName === 'shutdown') {
            // Действие для выключения
            const shutdownMessage = document.createElement('div');
            shutdownMessage.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                color: white;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 3em;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                text-align: center;
            `;
            shutdownMessage.textContent = 'Shutting Down...';
            document.body.appendChild(shutdownMessage);

            setTimeout(() => {
                document.body.removeChild(shutdownMessage);
                showSystemSelection(); // Перезапуск, переходя к выбору системы после выключения
            }, 2000); // Симулируем выключение в течение 2 секунд
        }
    }

    // --- Функциональность модального окна настроек ---
    function showSettingsModal() {
        // Скрываем все остальные основные элементы пользовательского интерфейса (кроме HighDesktop, который должен быть на заднем плане)
        startMenuModal.style.display = 'none';
        staffLoginModal.style.display = 'none';
        staffMenuContainer.style.display = 'none';
        kioskClosedMessage.style.display = 'none';
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        systemSelectionModal.style.display = 'none';
        // highDesktopModal должен оставаться 'flex', так как это фон
        
        settingsModal.style.display = 'flex';
        globalStaffAccessButtonContainer.style.display = 'none'; // Кнопка входа персонала скрыта, пока открыты настройки
    }

    function closeSettingsModalFunc() {
        settingsModal.style.display = 'none';
        showHighDesktop(); // Возвращаемся к HighDesktop после закрытия настроек
    }

    function synchronizeTouchScreen() {
        settingsModal.style.display = 'none'; // Скрываем модальное окно настроек
        globalStaffAccessButtonContainer.style.display = 'none'; // Скрываем кнопку персонала во время синхронизации

        const syncOverlay = document.createElement('div');
        syncOverlay.id = 'touchSyncOverlay';
        syncOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10002; /* Выше highDesktopModal */
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 2em;
            cursor: crosshair;
        `;
        document.body.appendChild(syncOverlay);

        const instructions = document.createElement('div');
        instructions.id = 'syncInstructions';
        instructions.textContent = 'Tap the circle to synchronize the touch screen.';
        instructions.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0,0,0,0.7);
            padding: 20px 40px;
            border-radius: 10px;
            text-align: center;
            font-size: 1em;
            z-index: 10003;
        `;
        syncOverlay.appendChild(instructions);


        const points = [
            { id: 'syncPoint1', style: 'top: 20px; left: 20px;' },      // Сверху-слева
            { id: 'syncPoint2', style: 'top: 20px; right: 20px;' },     // Сверху-справа
            { id: 'syncPoint3', style: 'bottom: 20px; right: 20px;' },  // Снизу-справа
            { id: 'syncPoint4', style: 'bottom: 20px; left: 20px;' }    // Снизу-слева
        ];

        let currentPointIndex = 0;
        let createdPoints = []; // Для хранения ссылок на созданные элементы точек

        function createPoint(pointData) {
            const point = document.createElement('div');
            point.id = pointData.id;
            point.classList.add('sync-point'); // Добавляем класс для общего стиля
            // Применяем позицию здесь напрямую, остальные стили из класса .sync-point
            point.style.cssText = `
                position: absolute;
                ${pointData.style}
            `;
            point.addEventListener('click', handlePointClick);
            syncOverlay.appendChild(point);
            return point;
        }

        // Создаем все точки, но изначально скрываем их
        points.forEach(p => createdPoints.push(createPoint(p)));

        function showNextPoint() {
            if (currentPointIndex < points.length) {
                instructions.style.display = 'block'; // Убедитесь, что инструкции видны для каждой точки
                createdPoints[currentPointIndex].style.display = 'flex'; // Показываем текущую точку
            } else {
                // Все точки нажаты, завершаем синхронизацию
                instructions.style.display = 'none'; // Скрываем инструкции
                syncOverlay.remove();
                // Показываем сообщение об успехе с помощью пользовательского окна сообщения
                const successMessage = document.createElement('div');
                successMessage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #333;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    z-index: 10005;
                    text-align: center;
                    font-size: 1.2em;
                    min-width: 250px;
                `;
                successMessage.innerHTML = `
                    <p>Touch screen synchronization complete!</p>
                    <button style="margin-top: 15px; padding: 10px 20px; background-color: #ffc72c; color: #bc002d; border: none; border-radius: 5px; cursor: pointer;" onclick="this.parentElement.remove(); showHighDesktop();">OK</button>
                `;
                document.body.appendChild(successMessage);
                globalStaffAccessButtonContainer.style.display = 'none'; // Кнопка персонала должна оставаться скрытой после синхронизации на рабочем столе
            }
        }

        function handlePointClick(event) {
            event.stopPropagation(); // Предотвращаем всплытие клика на оверлей
            this.style.display = 'none'; // Скрываем нажатую точку
            currentPointIndex++;
            showNextPoint();
        }

        // Начинаем процесс синхронизации, показывая первую точку
        showNextPoint();
    }


    // Навигация по клавиатуре для выбора системы
    document.addEventListener('keydown', (e) => {
        if (systemSelectionModal.style.display === 'flex') { // Отвечаем только если модальное окно выбора системы видно
            clearInterval(countdownInterval); // Останавливаем любой текущий отсчет автозагрузки
            clearTimeout(autoBootTimeout);

            systemOptions[selectedSystemIndex].classList.remove('active');

            if (e.key === 'ArrowDown') {
                selectedSystemIndex = (selectedSystemIndex + 1) % systemOptions.length;
                e.preventDefault(); // Предотвращаем прокрутку страницы
            } else if (e.key === 'ArrowUp') {
                selectedSystemIndex = (selectedSystemIndex - 1 + systemOptions.length) % systemOptions.length;
                e.preventDefault(); // Предотвращаем прокрутку страницы
            } else if (e.key === 'Enter') {
                e.preventDefault(); // Предотвращаем поведение Enter по умолчанию
                loadSystem(systemOptions[selectedSystemIndex].dataset.system);
                return; // Выходим, чтобы предотвратить дальнейшую обработку
            }
            systemOptions[selectedSystemIndex].classList.add('active');

            // Обновляем текст отсчета на основе выбранной системы, но перезапускаем автозагрузку только для HighKing Kiosk
            if (systemOptions[selectedSystemIndex].dataset.system === 'kiosk') {
                systemSelectionCountdown.textContent = `Booting HighKing Kiosk in 5...`;
                startAutoBootCountdown(); // Перезапускаем автозагрузку для выбранной опции, если это Kiosk
            } else if (systemOptions[selectedSystemIndex].dataset.system === 'highdesktop') {
                systemSelectionCountdown.textContent = `Press Enter to load HighDesktop.`;
            } else if (systemOptions[selectedSystemIndex].dataset.system === 'highbios') {
                systemSelectionCountdown.textContent = `Press Enter to load HighBIOS.`;
            }
        }
    });


    // --- Функциональность входа персонала ---
    function openStaffLoginModal() {
        // Убедитесь, что весь пользовательский интерфейс киоска скрыт
        startMenuModal.style.display = 'none';
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        kioskClosedMessage.style.display = 'none';
        systemSelectionModal.style.display = 'none'; // Скрываем выбор системы, если открыт
        highDesktopModal.style.display = 'none'; // Скрываем HighDesktop, если открыт
        settingsModal.style.display = 'none'; // Скрываем настройки, если открыты

        staffLoginModal.style.display = 'flex';
        staffCodeInput.value = '';
        staffLoginMessage.style.display = 'none';
        globalStaffAccessButtonContainer.style.display = 'block'; // Убедитесь, что кнопка персонала видна
        staffCodeInput.focus(); // Устанавливаем фокус на поле ввода
        staffLoginModal.dataset.loginMode = 'kiosk'; // Устанавливаем режим входа по умолчанию на "киоск"
        staffLoginModal.querySelector('h3').textContent = 'Staff Login'; // Убедитесь, что заголовок правильный
    }

    // NEW: Function to open login for HighDesktop specifically
    function openDesktopLoginModal() {
        startMenuModal.style.display = 'none';
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        kioskClosedMessage.style.display = 'none';
        systemSelectionModal.style.display = 'none';
        highDesktopModal.style.display = 'none';
        settingsModal.style.display = 'none';

        staffLoginModal.style.display = 'flex';
        staffCodeInput.value = '';
        staffLoginMessage.style.display = 'none';
        globalStaffAccessButtonContainer.style.display = 'none'; // Скрываем глобальную кнопку Staff Login
        staffCodeInput.focus();
        staffLoginModal.dataset.loginMode = 'desktop'; // Устанавливаем режим входа на "рабочий стол"
        staffLoginModal.querySelector('h3').textContent = 'HighDesktop Login'; // Изменяем заголовок модального окна
    }


    function closeStaffLogin() {
        const loginMode = staffLoginModal.dataset.loginMode || 'kiosk';
        staffLoginModal.style.display = 'none';
        staffCodeInput.value = ''; // Clear input on close
        staffLoginModal.querySelector('h3').textContent = 'Staff Login'; // Сбрасываем заголовок

        if (loginMode === 'desktop') {
            showSystemSelection(); // Если закрываем вход на рабочий стол, возвращаемся к выбору системы
            staffLoginModal.dataset.loginMode = 'kiosk'; // Сбрасываем режим
        } else { // Kiosk login flow
            if (localStorage.getItem('isKioskClosed') === 'true') {
                showKioskClosedMessage();
            } else {
                resetKioskToStartMenu();
            }
        }
    }

    // Унифицированная функция входа для клавиатуры и сканера штрих-кодов
    function attemptStaffLogin(code) {
        const loginMode = staffLoginModal.dataset.loginMode || 'kiosk'; // Default to kiosk

        if (loginMode === 'desktop') {
            if (code === '4321') { // Hardcoded for desktop access
                staffLoginMessage.textContent = 'Desktop Access Granted!';
                staffLoginMessage.style.color = 'green';
                console.log('Desktop Login: Access Granted.');
                setTimeout(() => {
                    staffLoginModal.style.display = 'none';
                    showHighDesktop(); // Show desktop on successful login
                    staffLoginModal.dataset.loginMode = 'kiosk'; // Reset mode
                }, 500);
            } else {
                staffLoginMessage.textContent = 'Invalid Desktop Code. Try Again.';
                staffLoginMessage.style.color = 'red';
                staffCodeInput.value = '';
                console.log('Desktop Login: Invalid Code.');
                // Не возвращаемся к выбору системы, а просто закрываем модальное окно входа
                // и возвращаемся к тому, что было до попытки входа на рабочий стол, 
                // что в данном случае должен быть экран выбора системы.
                setTimeout(() => {
                    staffLoginModal.style.display = 'none';
                    showSystemSelection(); 
                    staffLoginModal.dataset.loginMode = 'kiosk'; // Reset mode
                }, 1000);
            }
        } else { // 'kiosk' mode (original staff login logic)
            if (STAFF_ACCOUNTS.hasOwnProperty(code)) {
                currentStaffRole = STAFF_ACCOUNTS[code];
                localStorage.setItem('currentStaffRole', currentStaffRole);
                staffLoginMessage.textContent = 'Access Granted!';
                staffLoginMessage.style.color = 'green';
                console.log('Staff Login: Access Granted. Role:', currentStaffRole);
                
                setTimeout(() => {
                    staffLoginModal.style.display = 'none';
                    openStaffMenu();
                }, 500);
            } else {
                staffLoginMessage.textContent = 'Invalid Code. Try Again.';
                staffLoginMessage.style.color = 'red';
                staffCodeInput.value = '';
                currentStaffRole = null;
                localStorage.removeItem('currentStaffRole');
                console.log('Staff Login: Invalid Code.');
            }
        }
        staffLoginMessage.style.display = 'block';
    }

    // Handle keypad button clicks
    function handleKeypadInput(key) {
        if (key === 'clear') {
            staffCodeInput.value = '';
            console.log('Keypad: Cleared input');
        } else if (key === 'enter') {
            // This button now explicitly triggers login
            attemptStaffLogin(staffCodeInput.value);
        } else {
            if (staffCodeInput.value.length < 4) {
                staffCodeInput.value += key;
                console.log('Keypad: Input:', staffCodeInput.value);
            }
            staffLoginMessage.style.display = 'none'; // Hide message on new input
            // Automatically attempt login if 4 digits are entered
            if (staffCodeInput.value.length === 4) {
                attemptStaffLogin(staffCodeInput.value);
            }
        }
    }

    // Listen for global keyboard input when staff login modal is active
    document.addEventListener('keydown', (event) => {
        if (staffLoginModal.style.display === 'flex' && event.target !== staffCodeInput) { 
            // Only capture global keydown if staff login modal is visible and focus is not on staffCodeInput directly (e.g., if a scanner is used)
            // Prevent default behavior for numeric keys, Enter, Backspace
            if ((event.key >= '0' && event.key <= '9') || event.key === 'Enter' || event.key === 'Backspace') {
                event.preventDefault(); 
            }
            
            if (event.key >= '0' && event.key <= '9') {
                // If a digit is pressed, append it to staffCodeInput
                if (staffCodeInput.value.length < 4) { // Max 4 digits for keypad code
                    staffCodeInput.value += event.key;
                    staffLoginMessage.style.display = 'none'; // Hide message on new input
                }
                // Automatically attempt login if 4 digits are entered and not already doing so via keypad button
                if (staffCodeInput.value.length === 4) {
                    attemptStaffLogin(staffCodeInput.value);
                }
            } else if (event.key === 'Enter') {
                // If Enter is pressed, attempt login using the current staffCodeInput value
                attemptStaffLogin(staffCodeInput.value);
            } else if (event.key === 'Backspace') {
                // If Backspace is pressed, remove the last character
                staffCodeInput.value = staffCodeInput.value.slice(0, -1);
                staffLoginMessage.style.display = 'none'; // Hide message on new input
            }
        }
    });

    // --- Функции меню персонала ---
    function openStaffMenu() {
        staffLoginModal.style.display = 'none'; // Скрываем модальное окно входа
        kioskHeader.style.display = 'none';
        kioskMain.style.display = 'none';
        kioskFooter.style.display = 'none';
        systemSelectionModal.style.display = 'none';
        highDesktopModal.style.display = 'none';
        settingsModal.style.display = 'none';
        kioskClosedMessage.style.display = 'none';

        staffMenuContainer.style.display = 'flex'; // Показываем меню персонала
        globalStaffAccessButtonContainer.style.display = 'block'; // Keep staff button visible
        updateStaffMenuVisibility(); // Update menu button visibility
    }

    function closeStaffMenu() {
        staffMenuContainer.style.display = 'none';
        // Check if kiosk was closed to decide where to return
        if (localStorage.getItem('isKioskClosed') === 'true') {
            showKioskClosedMessage();
        } else {
            resetKioskToStartMenu();
        }
    }

    function updateStaffMenuVisibility() {
        if (currentStaffRole === 'basic') {
            manageOrdersButton.style.display = 'none';
            viewCustomerOrdersButton.style.display = 'none';
            restartSystemButton.style.display = 'none';
            logoutStaffButton.style.display = 'none'; // Скрываем кнопку выхода для базовой роли
        } else if (currentStaffRole === 'admin') {
            manageOrdersButton.style.display = 'block';
            viewCustomerOrdersButton.style.display = 'block';
            restartSystemButton.style.display = 'block';
            logoutStaffButton.style.display = 'block'; // Показываем кнопку выхода для админа
        }

        // Обновляем видимость кнопок открытия/закрытия киоска на основе его текущего состояния
        if (isKioskClosed) {
            closeKioskButton.style.display = 'none'; // Если киоск закрыт, скрываем кнопку "Close Kiosk"
            openKioskButton.style.display = 'block'; // Показываем кнопку "Open Kiosk"
        } else {
            closeKioskButton.style.display = 'block'; // Если киоск открыт, показываем кнопку "Close Kiosk"
            openKioskButton.style.display = 'none'; // Скрываем кнопку "Open Kiosk"
        }
    }

    // Event handler for "Close Kiosk" button
    closeKioskButton.addEventListener('click', () => {
        isKioskClosed = true; // Устанавливаем состояние киоска на "закрыт"
        localStorage.setItem('isKioskClosed', 'true'); // Сохраняем состояние в localStorage
        staffMessage.textContent = 'Kiosk is now Closed!'; // Сообщение о закрытии
        staffMessage.style.color = 'orange';
        staffMessage.style.display = 'block';
        updateStaffMenuVisibility(); // Обновляем видимость меню
        setTimeout(() => {
            closeStaffMenu(); // Закрываем меню персонала и возвращаемся к сообщению "Kiosk is Closed"
        }, 1000);
    });

    // Event handler for "Open Kiosk" button
    openKioskButton.addEventListener('click', () => {
        isKioskClosed = false; // Устанавливаем состояние киоска на "открыт"
        localStorage.setItem('isKioskClosed', 'false'); // Сохраняем состояние в localStorage
        staffMessage.textContent = 'Kiosk is now Open!'; // Сообщение об открытии
        staffMessage.style.color = 'green';
        staffMessage.style.display = 'block';
        updateStaffMenuVisibility(); // Обновляем видимость меню
        setTimeout(() => {
            closeStaffMenu(); // Закрываем меню персонала и возвращаемся в главное меню киоска
        }, 1000);
    });

    // Event handler for "Restart System" button
    restartSystemButton.addEventListener('click', () => {
        staffMessage.textContent = 'Restarting System...'; // Сообщение о перезапуске
        staffMessage.style.color = 'yellow';
        staffMessage.style.display = 'block';
        localStorage.removeItem('isKioskClosed'); // Очищаем состояние закрытия киоска при перезапуске
        localStorage.removeItem('currentStaffRole'); // Очищаем роль при перезапуске
        setTimeout(() => {
            window.location.reload(); // Перезагружаем страницу, чтобы начать с выбора системы
        }, 1000);
    });

    // Event handler for "Logout" button in Staff Menu
    logoutStaffButton.addEventListener('click', () => {
        localStorage.removeItem('currentStaffRole'); // Очищаем роль персонала при выходе
        localStorage.setItem('isKioskClosed', 'true'); // Закрываем киоск
        staffMenuContainer.style.display = 'none'; // Скрываем меню персонала
        openDesktopLoginModal(); // Отправляем пользователя на экран входа на рабочий стол
    });

    // --- Слушатели событий ---
    // Проверяем начальное состояние киоска при загрузке и отображаем соответствующим образом
    // Пользователь явно запросил, чтобы киоск запускался в закрытом состоянии,
    // а загрузчик не появлялся изначально.
    isKioskClosed = true; // Принудительно устанавливаем киоск в закрытое состояние при запуске
    localStorage.setItem('isKioskClosed', 'true');
    showKioskClosedMessage(); // Всегда начинаем с сообщения о закрытии киоска, минуя загрузчик изначально.

    startButton.addEventListener('click', showMainKioskUI);

    staffLoginButton.addEventListener('click', openStaffLoginModal);
    closeStaffLoginModal.addEventListener('click', closeStaffLogin);
    keypadButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            handleKeypadInput(event.target.dataset.key);
        });
    });

    // Слушатели событий для кнопок меню персонала
    manageOrdersButton.addEventListener('click', () => {
        // Устанавливаем флаг, чтобы указать возвращение в меню персонала при загрузке index.html
        localStorage.setItem('returnToStaffMenu', 'true');
        window.location.href = 'staff-orders.html'; // Перенаправляем на страницу управления заказами персонала
    });
    viewCustomerOrdersButton.addEventListener('click', () => {
        // Устанавливаем флаг, чтобы указать возвращение в меню персонала при загрузке index.html
        localStorage.setItem('returnToStaffMenu', 'true');
        window.location.href = 'orders.html'; // Перенаправляем на страницу заказов клиентов
    });

    // Check if coming back from staff-orders.html or orders.html and open staff menu
    if (localStorage.getItem('returnToStaffMenu') === 'true') {
        localStorage.removeItem('returnToStaffMenu'); // Clear the flag
        if (currentStaffRole) { // Only open if a staff role is set (meaning they were logged in)
            openStaffMenu();
        } else {
            // If they returned but not logged in as staff, go to system selection (which will then show kiosk closed message)
            showSystemSelection(); // This will lead to kioskClosedMessage due to initial load logic
        }
    }


    systemOptions.forEach(option => {
        option.addEventListener('click', () => {
            loadSystem(option.dataset.system);
        });
    });

    // HighDesktop specific event listeners
    desktopIconHighKing.addEventListener('dblclick', () => launchDesktopApp('highking-kiosk'));
    // desktopIconStaffLogin.addEventListener('dblclick', () => launchDesktopApp('staff-login-desktop')); // Удален по запросу пользователя
    startButtonDesktop.addEventListener('click', toggleStartMenu);
    startMenu.addEventListener('mouseleave', () => {
        startMenu.style.display = 'none'; // Закрываем меню "Пуск" при уходе мыши
    });
    startMenuItems.forEach(item => {
        item.addEventListener('click', () => launchDesktopApp(item.dataset.app));
    });

    // Слушатели событий модального окна настроек
    closeSettingsModal.addEventListener('click', closeSettingsModalFunc);
    syncTouchScreenButton.addEventListener('click', synchronizeTouchScreen);


    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;
            currentCategoryTitle.textContent = button.textContent;
            renderMenuItems(category);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', closeItemDetailModal);
    });

    // Этот глобальный слушатель кликов обрабатывает закрытие модальных окон при клике за их пределами.
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            const parentModal = event.target.closest('.modal');
            if (parentModal === itemDetailModal) {
                closeItemDetailModal();
            } else if (parentModal === paymentModal) {
                const statusText = paymentStatusMessage.textContent;
                if (!statusText.startsWith('Payment successful via') && !statusText.startsWith('Your cart is empty.')) {
                    closePaymentModal();
                }
            } else if (parentModal === staffLoginModal) {
                closeStaffLogin();
            } else if (parentModal === staffMenuContainer) { // Для меню персонала
                closeStaffMenu();
            } else if (parentModal === settingsModal) { 
                closeSettingsModalFunc(); 
            }
            // kioskClosedMessage, systemSelectionModal и HighDesktop modal не закрываются при клике за пределами по замыслу.
        }
    });


    checkoutButton.addEventListener('click', openPaymentModal);

    closePaymentModalButton.addEventListener('click', closePaymentModal);

    payByCardButton.addEventListener('click', () => simulatePayment('Card'));
    payByCashButton.addEventListener('click', () => simulatePayment('Cash'));
    payByMobileButton.addEventListener('click', () => simulatePayment('Mobile App'));

    cancelOrderButton.addEventListener('click', cancelOrder);

    updateCartSummary();

    // Initial update of staff menu visibility based on loaded role and kiosk status
    updateStaffMenuVisibility();
});
