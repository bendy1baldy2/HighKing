⚠️⚠️⚠️!!!THIS PROJECT MADE BY AI BUT IT'S STILL GOOD!!!⚠️⚠️⚠️
HighKing Kiosk System Documentation
This document provides instructions on how to use and manage the HighKing Kiosk system, including the main customer-facing kiosk, staff order management, and customer order viewing.

Table of Contents
HighKing Kiosk (Customer Interface)

Order Management (Staff)

Customer Order View

Staff Access and Menu

1. HighKing Kiosk (Customer Interface)
To use the main customer-facing kiosk, open the kiosk.html file in your web browser.

Features:

Initial Screen: The kiosk starts with a welcome screen. Click "Start Your Order" to proceed to the main menu.

Always Open: This standalone kiosk version is always operational and cannot be closed by staff from within this interface.

Product Selection: Browse through various categories (Burgers, Chicken & Fish, Sides & Fries, Drinks, Desserts, Breakfast, Happy Meal®).

Item Details: Click on any menu item to view its description, price, and add it to your cart.

Shopping Cart: Items are added to a cart summary at the bottom, showing the item count and total price.

Review Order & Pay: Proceed to the payment modal to complete your order.

Cancel Order: Clear your current order and return to the initial welcome screen.

Payment Options: Simulated payment methods include Card, Cash, and Mobile App. After a successful payment, your order will be sent for preparation, and the kiosk will reset to the welcome screen.

2. Order Management (Staff)
To manage orders as staff, open the staff-orders.html file in your web browser.

Features:

View All Orders: Displays all orders with their current status (Preparing, Ready, Completed).

Update Order Status:

Mark Ready: Change an order's status from "Preparing" to "Ready".

Mark Completed: Change an order's status from "Ready" to "Completed".

Reset to Preparing: Change an order's status from "Completed" back to "Preparing".

Delete Order: Individually delete any order from the list.

Delete All Completed Orders: Clear all orders that have a "Completed" status.

Refresh Orders: Manually refresh the list of orders. The list also auto-refreshes every 2 seconds.

3. Customer Order View
To view customer orders (e.g., on a display screen for customers), open the orders.html file in your web browser.

Features:

Display Active Orders: Only shows orders with "Preparing" or "Ready" status.

Real-time Updates: The order list automatically refreshes every 5 seconds to show the latest status changes.

Back to Kiosk: A button is provided to return to the index.html (the main kiosk application entry point).

4. Staff Access and Menu (in index.html application)
The staff menu and login functionality are part of the main index.html kiosk application, not the standalone kiosk.html.

To access the Staff Menu:

Open index.html in your web browser.

Click the "Staff Login" button.

Enter the staff code using the on-screen keypad or a connected barcode scanner/keyboard.

Staff Codes:

1234 (Basic Level): Can open and close the kiosk.

4321 (High Level / Admin): Has access to all staff menu options, including:

Manage Orders (redirects to staff-orders.html)

Show Orders to Customers (redirects to orders.html)

Close Kiosk

Open Kiosk

Restart System

Logout (from Staff Menu)

HighDesktop Access:

From the System Selection screen (shown after initial bootloader or restart), select "HighDesktop".

You will be prompted for a "HighDesktop Login".

Only code 4321 grants access to HighDesktop.

Logout from HighDesktop: The "Logout" button in the HighDesktop Start Menu will return you to the System Selection screen.
