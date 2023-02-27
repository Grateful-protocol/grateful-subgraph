import { GratefulSubscription as Subscription } from "../generated/schema";
import {
  SubscriptionFinished,
  SubscriptionStarted,
} from "../generated/SubscriptionsModule/SubscriptionsModule";
import {
  handleBalanceFlowChange,
  handleBalanceOutflowChange,
  handleBalanceInflowChange,
} from "./balances";
import { FeesModule } from "../generated/SubscriptionsModule/FeesModule";
import {
  handleProfileSubscribersChange,
  handleProfileSubscriptionsChange,
} from "./profiles";
import { BigInt } from "@graphprotocol/graph-ts";

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

  const ONE = BigInt.fromI32(1);

  // Handle giver balance
  const totalFlow = rate.plus(feeRate);
  handleBalanceFlowChange(event, giverId, vaultId, totalFlow.neg());
  handleBalanceOutflowChange(giverId, vaultId, totalFlow);
  handleProfileSubscriptionsChange(giverId, ONE);

  // Handle creator balance
  handleBalanceFlowChange(event, creatorId, vaultId, rate);
  handleBalanceInflowChange(creatorId, vaultId, rate);
  handleProfileSubscribersChange(creatorId, ONE);

  // Handle treasury balance
  const treasuryId = FeesModule.bind(event.address).getFeeTreasuryId();
  handleBalanceFlowChange(event, treasuryId, vaultId, feeRate);
  handleBalanceInflowChange(treasuryId, vaultId, feeRate);
  handleProfileSubscribersChange(treasuryId, ONE);
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

    const MINUS_ONE = BigInt.fromI32(1).neg();

    // Handle giver balance
    const totalFlow = rate.plus(feeRate);
    handleBalanceFlowChange(event, giverId, vaultId, totalFlow);
    handleBalanceOutflowChange(giverId, vaultId, totalFlow.neg());
    handleProfileSubscriptionsChange(giverId, MINUS_ONE);

    // Handle creator balance
    handleBalanceFlowChange(event, creatorId, vaultId, rate.neg());
    handleBalanceInflowChange(creatorId, vaultId, rate.neg());
    handleProfileSubscribersChange(creatorId, MINUS_ONE);

    // Handle treasury balance
    const treasuryId = FeesModule.bind(event.address).getFeeTreasuryId();
    handleBalanceFlowChange(event, treasuryId, vaultId, feeRate.neg());
    handleBalanceInflowChange(treasuryId, vaultId, feeRate.neg());
    handleProfileSubscribersChange(treasuryId, MINUS_ONE);
  }
}
