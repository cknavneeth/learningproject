declare module 'razorpay' {
   class Razorpay {
    constructor(options: {
      key_id: string;
      key_secret: string;
    });

    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt: string;
        notes?: Record<string, any>;
      }): Promise<{
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        status: string;
        created_at: number;
      }>;
    };

    payments: {
      fetch(paymentId: string): Promise<{
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        created_at: number;
      }>;
    };
  }
  export = Razorpay;
}