const crypto = require('crypto');
const paymentModel = require('../model/paymentModel');
const bookingModel = require('../model/bookingModel');
const notificationModel = require('../model/notificationModel');

const MERCHANT_CODE  = process.env.ESEWA_MERCHANT_CODE  || 'EPAYTEST';
const SECRET_KEY     = process.env.ESEWA_SECRET_KEY     || '8gBm/:&EnhH.1/q';
const PAYMENT_URL    = process.env.ESEWA_PAYMENT_URL    || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const FRONTEND_URL   = process.env.FRONTEND_URL         || 'http://localhost:5173';

const sign = (message) =>
  crypto.createHmac('sha256', SECRET_KEY).update(message).digest('base64');

const initiateESewa = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const booking = await bookingModel.getBookingById(booking_id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customer_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorised' });

    const existing = await paymentModel.getPaymentByBookingId(booking_id);
    if (existing && existing.status === 'completed')
      return res.status(400).json({ success: false, message: 'This booking is already paid' });

    const transaction_uuid = `${booking.reference_code}-${Date.now()}`;
    const total_amount     = Number(booking.total_amount);
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${MERCHANT_CODE}`;
    const signature = sign(message);

    if (!existing) {
      await paymentModel.createPayment({
        booking_id:     booking.id,
        customer_id:    req.user.id,
        amount:         total_amount,
        method:         'esewa',
        status:         'pending',
        transaction_id: transaction_uuid,
      });
    } else {
      await paymentModel.updateTransactionId(existing.id, transaction_uuid);
    }

    res.json({
      success: true,
      data: {
        payment_url:               PAYMENT_URL,
        amount:                    total_amount,
        tax_amount:                0,
        total_amount:              total_amount,
        transaction_uuid,
        product_code:              MERCHANT_CODE,
        product_service_charge:    0,
        product_delivery_charge:   0,
        success_url:               `${FRONTEND_URL}/payment/success`,
        failure_url:               `${FRONTEND_URL}/payment/failure`,
        signed_field_names:        'total_amount,transaction_uuid,product_code',
        signature,
      },
    });
  } catch (err) {
    console.error('eSewa initiate error:', err.message);
    res.status(500).json({ success: false, message: 'Could not initiate payment' });
  }
};

const verifyESewa = async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) return res.status(400).json({ success: false, message: 'No payment data' });

    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    const { transaction_uuid, transaction_code, status, signed_field_names, signature } = decoded;

    const fieldNames = signed_field_names.split(',');
    const message    = fieldNames.map((f) => `${f}=${decoded[f]}`).join(',');
    const expected   = sign(message);

    if (expected !== signature)
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });

    if (status !== 'COMPLETE')
      return res.status(400).json({ success: false, message: 'Payment not completed' });

    const payment = await paymentModel.getPaymentByTransactionId(transaction_uuid);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

    if (payment.status === 'completed')
      return res.json({ success: true, message: 'Already verified', booking_id: payment.booking_id });

    await paymentModel.updatePayment(payment.id, { status: 'completed', paid_at: new Date() });

    await notificationModel.createNotification({
      user_id: payment.customer_id,
      type:    'payment',
      title:   'Payment successful',
      body:    `Your eSewa payment of Rs ${Number(payment.amount).toLocaleString()} was successful. Ref: ${transaction_code}`,
    }).catch(() => {});

    res.json({ success: true, message: 'Payment verified', booking_id: payment.booking_id });
  } catch (err) {
    console.error('eSewa verify error:', err.message);
    res.status(500).json({ success: false, message: 'Could not verify payment' });
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const payment = await paymentModel.getPaymentByBookingId(req.params.bookingId);
    res.json({ success: true, data: payment || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch payment' });
  }
};

module.exports = { initiateESewa, verifyESewa, getPaymentStatus };
