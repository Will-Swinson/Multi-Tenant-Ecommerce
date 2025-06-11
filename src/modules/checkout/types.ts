import Stripe from "stripe";

export type ProductMetaData = {
  stripeAccountId: string;
  id: string;
  price: number;
  name: string;
};

export type CheckoutMetadata = {
  userId: string;
};

export type StripeLineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export type ExpandedLineItem = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetaData;
    };
  };
};
