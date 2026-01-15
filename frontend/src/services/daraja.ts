const DARAJA_BASE_URL = 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = import.meta.env.VITE_DARAJA_CONSUMER_KEY || 'demo-key';
const CONSUMER_SECRET = import.meta.env.VITE_DARAJA_CONSUMER_SECRET || 'demo-secret';
const BUSINESS_SHORT_CODE = import.meta.env.VITE_DARAJA_BUSINESS_SHORT_CODE || '174379';
const PASSKEY = import.meta.env.VITE_DARAJA_PASSKEY || 'bfb279f9ba9b9d1380007480357f2300';
const CALLBACK_URL = import.meta.env.VITE_DARAJA_CALLBACK_URL || 'https://localhost:3000/api/callback';

export interface STKPushPayload {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDescription: string;
  orderId: string;
}

export interface STKPushResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
}

export interface PaymentStatus {
  ResultCode: string;
  ResultDesc: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
}

// Generate access token for Daraja API
const getAccessToken = async (): Promise<string> => {
  try {
    const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    const response = await fetch(
      `${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Generate password for Daraja STK push
const generatePassword = (): string => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const passwordString = `${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`;
  return btoa(passwordString);
};

// Get current timestamp in Daraja format
const getTimestamp = (): string => {
  return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
};

// Initiate STK push for M-Pesa payment
export const initiateSTKPush = async (payload: STKPushPayload): Promise<STKPushResponse> => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword();

    // Format phone number to include country code if not present
    let phoneNumber = payload.phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.startsWith('254')) {
      phoneNumber = '254' + (phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber);
    }

    const requestBody = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(payload.amount),
      PartyA: phoneNumber,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: CALLBACK_URL,
      AccountReference: payload.accountReference,
      TransactionDesc: payload.transactionDescription,
    };

    const response = await fetch(
      `${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to initiate STK push');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating STK push:', error);
    throw error;
  }
};

// Query transaction status
export const queryTransactionStatus = async (
  checkoutRequestID: string
): Promise<PaymentStatus> => {
  try {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = generatePassword();

    const requestBody = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const response = await fetch(
      `${DARAJA_BASE_URL}/mpesa/stkpushquery/v1/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to query transaction status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying transaction status:', error);
    throw error;
  }
};
