import nodemailer from 'nodemailer';
import { IOrder } from '../models/Order.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

const formatPrice = (price: number): string => {
  return `KES ${price.toFixed(2)}`;
};

const generateOrderHTML = (order: IOrder): string => {
  const itemsList = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
        <div style="font-weight: 600;">${item.name}</div>
        ${item.description ? `<div style="font-size: 13px; color: #666;">${item.description}</div>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">${formatPrice(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 600;">${formatPrice(
        item.price * item.quantity
      )}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .order-number {
      background-color: #f0f9ff;
      border-left: 4px solid #ec4899;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #222;
    }
    .info-row {
      display: flex;
      margin: 8px 0;
    }
    .label {
      font-weight: 600;
      width: 120px;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    table th {
      background-color: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    .total-section {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      font-size: 16px;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: 700;
      color: #ec4899;
      border-top: 2px solid #ddd;
      padding-top: 10px;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background-color: #ec4899;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎂 Order Confirmation</h1>
      <p>Thank you for your order!</p>
    </div>
    
    <div class="content">
      <p>Hello ${order.customerName},</p>
      
      <p>We have received your order and are excited to prepare your delicious custom cakes!</p>
      
      <div class="order-number">
        <div style="font-weight: 600; font-size: 18px;">${order.orderNumber}</div>
        <div style="font-size: 13px; color: #666; margin-top: 5px;">Order Number</div>
      </div>

      <div class="section">
        <div class="section-title">📦 Order Details</div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.totalAmount)}</span>
          </div>
          <div class="total-row">
            <span>Delivery:</span>
            <span>Free</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Amount:</span>
            <span>${formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📍 Shipping Address</div>
        <div class="info-row">
          <div>${order.shippingAddress.street}</div>
        </div>
        <div class="info-row">
          <div>${order.shippingAddress.city}, ${order.shippingAddress.zipCode}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📋 Order Status</div>
        <div style="background-color: #f0f9ff; padding: 12px; border-radius: 4px; border-left: 4px solid #3b82f6;">
          <strong>Current Status:</strong> ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </div>
      </div>

      <div class="section">
        <div class="section-title">❓ What's Next?</div>
        <p>We're preparing your custom cakes with care. You'll receive another email update once your order is ready for delivery.</p>
        <p>If you have any questions, please don't hesitate to contact us at support@sweettreats.com or call us at +254-712-345-678.</p>
      </div>

      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/track/${order.orderNumber}" class="btn">Track Your Order</a>

      <div class="footer">
        <p>Thank you for choosing Sweet Treats! 🎉</p>
        <p>&copy; ${new Date().getFullYear()} Sweet Treats. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const sendOrderConfirmation = async (order: IOrder): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `Sweet Treats <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: generateOrderHTML(order),
    });

    console.log(`Order confirmation email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

export const sendOrderStatusUpdate = async (
  email: string,
  orderNumber: string,
  status: string
): Promise<void> => {
  try {
    const statusMessages: { [key: string]: string } = {
      confirmed: 'Your order has been confirmed and we are preparing it!',
      preparing: 'Your order is being prepared in our kitchen.',
      ready: 'Your order is ready for delivery!',
      delivered: 'Your order has been delivered. Thank you!',
    };

    await transporter.sendMail({
      from: `Sweet Treats <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Status Update - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 4px; }
            .content { background: white; padding: 20px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Status Update 📦</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Good news! ${statusMessages[status] || 'Your order status has been updated.'}</p>
              <p><strong>Order Number:</strong> ${orderNumber}</p>
              <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
              <p>We appreciate your patience and your business!</p>
              <p>Best regards,<br>Sweet Treats Team 🎂</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Status update email sent to ${email}`);
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
};
