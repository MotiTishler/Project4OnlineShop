The project is a SPA that simulates an online health store. It combines management of customers, product, carts and deliveries.

Login page:
-----------
The page has 3 divs: Login form on the left, an about section in the center, and a messages section on the right.
The username must be a valid email address. At the time of registration a residential address must be provided which will be the default for deliveries.
After logging in, an "Enter" button will appear on the page and a personal message according to the user:
For a new customer - Welcome
For a customer starting a new purchase - Your last purchase was at ...
For a customer who who has an open shopping cart - Continue your purchase
No message for an administrator.


User management and permissions:
--------------------------------
1. Customer:
A list of categories will appear on the right side of the main page, product cards - in the center, and on the left side - the shopping cart.

The cart will shrink on the left side and will expand as the mouse hovers over it.
Double-clicking on a product card will add it to the cart.
At the top of the page will be a search box.
The products will be displayed by the selected category or by the search box (search for "tea" for example).
At the end of the purchase, an invoice will be displayed: the list of products and prices. After that, a delivery order form will be opened.
Requirements for the form:
- Double-clicking on the shipping address field will fill in the address given at the time of registration.
- Up to 5 deliveries per day should be allowed
- As a replacement for a credit information form - we will settle for the last 4 digits of a credit card. Clicking on 'Pay' will simulate a payment approved by the credit company (without having to exercise the referral to the company).
- After the payment, a suitable message will appear and an option to download the receipt will be given.

To login as a customer: username:user@4.proj, password:1234.

2. Administrator:
The main page is similar to the main page above: category list, product cards and search box. An add/edit form will appear instead of the shopping cart.
Double-clicking on a product will fill out the form with the product details.

To login as an administrator: username:admin@4.proj, password:1234.


The stack:
----------
DB: MySql
Server: nodeJS
Client: Angular

Main challenges:
----------------
- DB:
Proper design of tables. Relationships between tables.

- Server:
Proper design of routes
Using middlewares
Authentication (jwt)
Permission management (admin only / users only)
Encryption and decryption of passwords (bcrypt)
Creating pdf files (pdfkit)

- Client:
Proper components design (Angular).
Angular Material design
services
Using guards for user management (user / admin).
Validations: built-in and user-defined
Downloading pdf files from the server (file-saver)



================================
Hebrew:
================================
הפרוייקט מכיל SPA המדמה חנות אונליין. יש לנהל לקוחות, מוצרים (מחולקים לקטגוריות), עגלות קניה ומשלוחים.

במסך הכניסה אפשר להתחבר או להרשם. שם המשתמש יהיה כתובת דוא"ל תקנית. בזמן הרשמה יש לספק גם כתובת מגורים שתהווה ברירת מחדל למשלוחים.
 
עבור התחברות כלקוח:
לאחר ההתחברות יופיעו במסך הכניסה לחצן כניסה והודעה למשתמש: למשתמש חדש - ברוך הבא / למשתמש בעל עגלה פתוחה - המשך בקניה / למשתמש שמתחיל קניה - תאריך קניה קודמת.
במרכז העמוד הראשי כרטיסי המוצרים. לחיצה על מוצר (double-click) תוסיף אותו לעגלה. מימין - רשימת הקטגוריות. למעלה - שדה חיפוש. תצוגה לפי הקטגוריה הנבחרת או לפי הטקסט בתיבת החיפוש. (חפשו tea, לדוגמא).
עגלת הקניות ממוזערת משמאל ונכנסת במעבר העכבר עליה.
עם סיום הקניה תוצג החשבונית: רשימת המוצרים והמחירים. לאחר מכן יפתח טופס הזמנת משלוח  - יש לאפשר עד 5 משלוחים ביום. double-click על שדה הכתובת למשלוח ימלא את הכתובת שנתנה בזמן ההרשמה.
כתחליף לטופס פרטי אשראי - נסתפק ב-4 ספרות אחרונות של כרטיס אשראי, ולחיצה על 'תשלום' תדמה תשלום מאושר ע"י חברת האשראי (בלי צורך לממש את הפניה לחברה).
לאחר התשלום תופיע הודעה מתאימה ותנתן אפשרות להוריד את הקבלה.
במערכת כבר קיים לקוח. שם משתמש: user@4.proj. סיסמה: 1234.

עבור מנהל:
המסגרת הכללית של העמוד דומה ללקוח רגיל: כרטיסי מוצרים, רשימת קטגוריות ותיבת חיפוש. במקום עגלת הקניות יופיע טופס עריכת מוצר/מוצר חדש. double-click על מוצר ימלא את הטופס בפרטי המוצר.
שם משתמש של המנהל: admin@4.proj. סיסמה: 1234.

ה-stack:
בסיס נתונים: MySql
צד שרת: nodeJS
צד לקוח: Angular

אתגרים עיקריים:

בסיס נתונים: 
בניה נכונה של טבלאות. קשרים בין טבלאות.

צד שרת: 
חלוקה נכונה ל-routes
שימוש נכון ב-middlewares
ניהול הרשאות: admin only / users only במקומות הנדרשים.
אותנטיקציה באמצעות jwt.
הצפנה ופענוח של הסיסמה ושל ה-token באמצעות bcrypt.
יצירת קבצי PDF להורדה (באמצעות חבילת pdfkit).


צד לקוח:
חלוקה נכונה לקומפוננטות ובנייתן באמצעות Angular.
עיצוב באמצעות angular/material.
services 
שימוש ב-guards לניהול משתמשים (user/admin).
ואלידציות (מובנות ואישיות).
הורדת קבצים מהשרת (באמצעות חבילת file-saver).




הערות כלליות:

משתמשים קיימים במערכת:

מנהל מערכת -
admin@4.proj
סיסמה: 1234

משתמש כללי -
user@4.proj
סיסמה: 1234

משתמש נוסף:
johny@4.proj
סיסמה: 4321


עבור ולידציה ששם המשתמש הוא כתובת דוא"ל תקינה השתמשתי ב-regex פשוט: 
<some name>@<some site name>.<some extantion>
לכן סיומת .proj היא תקינה בפרוייקט. 
