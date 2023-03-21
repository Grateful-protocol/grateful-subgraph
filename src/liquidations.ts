import { Bytes } from "@graphprotocol/graph-ts";
import { SubscriptionLiquidated } from "../generated/LiquidationsModule/LiquidationsModule";
import { LiquidatedSubscription } from "../generated/schema";

export function handleSubscriptionLiquidated(
  event: SubscriptionLiquidated
): void {
  const giver = event.params.giverId;
  const creator = event.params.creatorId;
  const liquidator = event.params.liquidatorId;
  const subscriptionId = Bytes.fromByteArray(
    Bytes.fromBigInt(event.params.subscriptionId)
  );

  const liquidationId = giver.concat(creator).concat(liquidator);

  const liquidation = new LiquidatedSubscription(liquidationId);

  liquidation.giver = giver;
  liquidation.creator = creator;
  liquidation.liquidator = liquidator;
  liquidation.vault = event.params.vaultId;
  liquidation.subscription = subscriptionId;
  liquidation.reward = event.params.reward;
  liquidation.surplus = event.params.surplus;

  liquidation.save();
}
