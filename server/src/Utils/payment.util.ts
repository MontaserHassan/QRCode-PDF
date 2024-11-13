/* eslint-disable prettier/prettier */
import { stripe } from '../Configs/stripe.config';



export default class Payment {
    constructor() { };

    async pay(amount: number, userId: string) {
        // use session
        const paymentSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: 'http://127.0.0.1:5500/payment-test/payment-success.html',
            cancel_url: 'http://127.0.0.1:5500/payment-test/payment-cancel.html',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',

                    },
                },
            ],
        })
    }
};