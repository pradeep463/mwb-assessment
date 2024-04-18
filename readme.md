Node JS Assessment

Date: 17-apr-2024

MWB Technologies Ltd.

Design a project using Node JS to onboard users and generate orders. Detailed
requirements are as follows:

1. Register API: Create an API to register a admin &amp; user and store in DB - Done
2. Login API: Create an API to enable admin &amp; user to login (use any auth token) - Done
3. Add product: Create an API for admin to add product to DB - Done
4. Delete product: Create an API for admin to delete product to DB - Done
5. View product: Create an API for admin &amp; user view product - Done
6. Order a product: Create an API for user to order a product - Done
7. View orders: Create an API for user to View ordered products - Done
8. View orders received: Create an API for admin to View orders received - Done
9. Create a cron that send mail to admin with orders received on that day. Cron must
   run at 10:00 PM every day.

Note:
Use NodeJS for backend and MongoDB for database operations
Assessment to be by 20-APR-2024 05:00 PM

-------------------------------------------------------------------------------------
.env

-------------------------------------------------------------------------------------
PORT=8000
API_V1='/api/v1'

DB_URL='mongodb+srv://clust:clust@cluster0.brjiept.mongodb.net/mwb_assessment'

JWT_SECRET='qwertyuiop'
SENDBLUE_KEY=''

MODE="localhost"
# MODE="development"
# MODE="staging"
# MODE="production"


