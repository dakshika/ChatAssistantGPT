// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "@/types";
import {
  basicPlan,
  freePlan,
  hobbyPlan,
  proPlan,
} from "@/config/subscriptions";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  //const hasPlan = user.stripePriceId &&
  //   user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()
  const hasPlan = true;
  let plan = freePlan;
  if (hasPlan) {
     // const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)

    const subscription = {
        "id": "si_NcLYdDxLHxlFo7",
        "object": "subscription_item",
        "billing_thresholds": null,
        "created": 1680126546,
        "metadata": {},
        "plan": {
          "id": "price_1Mr6rdLkdIwHu7ixwPmiybbR",
          "object": "price",
          "active": true,
          "billing_scheme": "per_unit",
          "created": 1680126545,
          "currency": "usd",
          "custom_unit_amount": null,
          "discounts": null,
          "livemode": false,
          "lookup_key": null,
          "metadata": {},
          "nickname": "proPlan",
          "product": "prod_NcLYGKH0eY5b8s",
          "recurring": {
            "aggregate_usage": null,
            "interval": "month",
            "interval_count": 1,
            "trial_period_days": null,
            "usage_type": "licensed"
          },
          "tax_behavior": "unspecified",
          "tiers_mode": null,
          "transform_quantity": null,
          "type": "recurring",
          "unit_amount": 1000,
          "unit_amount_decimal": "1000"
        },
        "quantity": 2,
        "subscription": "sub_1Mr6rbLkdIwHu7ix4Xm9Ahtd",
        "tax_rates": [],
        "brandingCustomization": true,
        "basicCustomization": true,
        "userInquiries": true,
        "maxChatbots":10
      };

    if (subscription.plan.nickname === "Pro plan") {
      plan = proPlan;
    } else if (subscription.plan.nickname === "Hobby plan") {
      plan = hobbyPlan;
    } else if (subscription.plan.nickname === "Basic plan") {
      plan = basicPlan;
    }


  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
  };
}
