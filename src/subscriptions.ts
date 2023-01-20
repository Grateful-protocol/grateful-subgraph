import { GratefulSubscription as Subscription } from "../generated/schema";
import {
  SubscriptionFinished,
  SubscriptionStarted,
} from "../generated/SubscriptionsModule/SubscriptionsModule";
import { handleBalanceFlowChange } from "./balances";
import { FeesModule } from "../generated/SubscriptionsModule/FeesModule";

export function handleSubscriptionStarted(event: SubscriptionStarted): void {
  const subscriptionId = event.params.subscriptionId.toString();
  const giverId = event.params.giverId;
  const creatorId = event.params.creatorId;
  const vaultId = event.params.vaultId;
  const rate = event.params.rate;
  const feeRate = event.params.feeRate;

  let subscription = Subscription.load(subscriptionId);

  if (subscription == null) {
    subscription = new Subscription(subscriptionId);
    subscription.giver = giverId;
    subscription.creator = creatorId;
  }

  subscription.vault = vaultId;
  subscription.rate = rate;
  subscription.feeRate = feeRate;
  subscription.lastUpdate = event.block.timestamp;

  subscription.save();

  // Handle giver balance
  const totalFlow = rate.plus(feeRate).neg();
  handleBalanceFlowChange(event, giverId, vaultId, totalFlow);

  // Handle creator balance
  handleBalanceFlowChange(event, creatorId, vaultId, rate);

  // Handle treasury balance
  const treasuryId = FeesModule.bind(event.address).getFeeTreasuryId();
  handleBalanceFlowChange(event, treasuryId, vaultId, feeRate);
}

export function handleSubscriptionFinished(event: SubscriptionFinished): void {
  const subscriptionId = event.params.subscriptionId.toString();
  const giverId = event.params.giverId;
  const creatorId = event.params.creatorId;
  const vaultId = event.params.vaultId;
  const rate = event.params.rate;
  const feeRate = event.params.feeRate;

  let subscription = Subscription.load(subscriptionId);

  if (subscription) {
    subscription.vault = null;
    subscription.rate = null;
    subscription.feeRate = null;
    subscription.lastUpdate = event.block.timestamp;

    subscription.save();

    // Handle giver balance
    const totalFlow = rate.plus(feeRate);
    handleBalanceFlowChange(event, giverId, vaultId, totalFlow);

    // Handle creator balance
    handleBalanceFlowChange(event, creatorId, vaultId, rate.neg());

    // Handle treasury balance
    const treasuryId = FeesModule.bind(event.address).getFeeTreasuryId();
    handleBalanceFlowChange(event, treasuryId, vaultId, feeRate.neg());
  }
}
