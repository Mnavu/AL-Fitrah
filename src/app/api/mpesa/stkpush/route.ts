import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, phone, orderId } = await req.json();

    // 1. Format Phone Number (Kenyan standard 254...)
    let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // 2. Daraja OAuth Token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    const tokenRes = await fetch('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    
    const { access_token } = await tokenRes.json();

    if (!access_token) {
      throw new Error('Failed to generate M-Pesa OAuth token. Check your credentials.');
    }

    // 3. STK Push Parameters
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const stkPushRes = await fetch('https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        AccountReference: orderId || 'AL-FITRAH',
        TransactionDesc: 'Course Registration'
      })
    });

    const stkData = await stkPushRes.json();

    if (stkData.ResponseCode !== '0') {
      return NextResponse.json({ 
        success: false, 
        message: stkData.CustomerMessage || 'STK Push failed to trigger.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      merchantRequestId: stkData.MerchantRequestID,
      checkoutRequestId: stkData.CheckoutRequestID
    });

  } catch (error: any) {
    console.error('M-Pesa STK Push Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
