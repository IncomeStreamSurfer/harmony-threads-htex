import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (!_stripe) {
    const key = import.meta.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY ?? "";
    _stripe = new Stripe(key, { apiVersion: "2025-01-27.acacia" });
  }
  return _stripe;
}
