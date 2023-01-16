import {
  GratefulSubscription as Subscription,
  Balance,
} from "../generated/schema";
import {
  SubscriptionFinished,
  SubscriptionStarted,
} from "../generated/SubscriptionsModule/SubscriptionsModule";

export function handleSubscriptionStarted(event: SubscriptionStarted): void {
  const subscriptionId = event.params.subscriptionId.toString();

  let subscription = Subscription.load(subscriptionId);

  if (subscription == null) {
    subscription = new Subscription(subscriptionId);
    subscription.giver = event.params.giverId;
    subscription.creator = event.params.creatorId;
  }

  subscription.vault = event.params.vaultId;
  subscription.rate = event.params.rate;
  subscription.feeRate = event.params.feeRate;
  subscription.lastUpdate = event.block.timestamp;

  subscription.save();
}

export function handleSubscriptionFinished(event: SubscriptionFinished): void {
  const subscriptionId = event.params.subscriptionId.toString();

  let subscription = Subscription.load(subscriptionId);

  if (subscription) {
    subscription.vault = null;
    subscription.rate = null;
    subscription.feeRate = null;
    subscription.lastUpdate = event.block.timestamp;

    subscription.save();
  }
}
