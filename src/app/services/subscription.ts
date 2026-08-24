import { apiClient } from "../api/api-client";

export type PlanLimits = {
  max_links: number;
  max_clicks_per_month: number;
  max_websites: number;
  max_team_members: number;
  custom_domains: boolean;
  analytics: "basic" | "advanced" | "full";
  api_access: boolean;
  bio_pages: number;
  qr_codes: number;
  campaigns: boolean;
  file_assets: boolean;
  webhooks: boolean;
  link_expiry: boolean;
  password_protection: boolean;
};

export type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  is_default: boolean;
  sort_order: number;
  features: string[];
  limits: PlanLimits;
};

export type Subscription = {
  id: string;
  organization_id: string;
  plan_id: string;
  plan_name: string;
  plan_slug: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  limits: PlanLimits;
  status: "active" | "trialing" | "canceled" | "past_due" | "expired";
  billing_period: "monthly" | "yearly" | "lifetime";
  current_period_start: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  rzp_subscription_id: string | null;
  locked_price_monthly: number | null;
  locked_price_yearly: number | null;
  force_reprice: boolean;
};

export type RzpPayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
  method: string;
  description: string | null;
};

export const getActivePlans = (): Promise<Plan[]> =>
  apiClient.get("/plans").then((d: any) => d.plans ?? d);

export const getCurrentSubscription = (): Promise<{
  subscription: Subscription | null;
  defaultPlan: Plan | null;
}> => apiClient.get("/subscription");

export const selectPlan = (
  planId: string,
  billingPeriod: "monthly" | "yearly" = "monthly",
): Promise<{ subscription: Subscription; requiresPayment?: boolean }> =>
  apiClient.post("/subscription/select", {
    plan_id: planId,
    billing_period: billingPeriod,
  });

export type RzpCheckoutData = {
  rzpSubscriptionId: string;
  rzpKeyId: string;
  planName: string;
  amount: number;
  currency: string;
  billingPeriod: string;
};

export const createRzpSubscription = (
  planId: string,
  billingPeriod: "monthly" | "yearly",
): Promise<RzpCheckoutData> =>
  apiClient.post("/subscription/create-rzp", {
    plan_id: planId,
    billing_period: billingPeriod,
  });

export const verifyRzpPayment = (payload: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}): Promise<{ subscription: Subscription }> =>
  apiClient.post("/subscription/verify-rzp", payload);

export const cancelSubscription = (): Promise<{ subscription: Subscription }> =>
  apiClient.post("/subscription/cancel");

export type UpcomingPayment = {
  chargeAt: number;
  amount: number;
  paidCount: number;
  remainingCount: number | null;
};

export const getSubscriptionPayments = (): Promise<{
  payments: RzpPayment[];
  upcoming: UpcomingPayment | null;
}> => apiClient.get("/subscription/payments");
