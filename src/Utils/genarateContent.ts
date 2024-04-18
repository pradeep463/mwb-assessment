export const genContent = (ordersData: any) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orders Received Today</title>
      <style>
        /* Add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .order {
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
        }
        .order-details {
          margin-top: 10px;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Orders Received Today</h2>
  `;

  ordersData.forEach((order: any, index: number) => {
    html += `
      <div class="order">
        <h3>Order ${index + 1}</h3>
        <p><strong>Name:</strong> ${order.name}</p>
        <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Order Details:</strong></p>
        <ul class="order-details">
    `;
    order.orderDetails.forEach((orderDetail: any) => {
      html += `<li>${orderDetail.name} - ${orderDetail.quantity} x ${orderDetail.price}</li>`;
    });
    html += `
        </ul>
      </div>
    `;
  });

  html += `
      </div>
    </body>
    </html>
  `;

  return html;
};
