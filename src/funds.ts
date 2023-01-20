import {
  FundsDeposited,
  FundsWithdrawn,
} from "../generated/FundsModule/FundsModule";
import { getBalance } from "./balances";

export function handleFundsDeposited(event: FundsDeposited): void {
  const profileId = event.params.profileId;
  const vaultId = event.params.vaultId;
  const amount = event.params.shares;

  const balance = getBalance(profileId, vaultId);

  balance.amount = balance.amount.plus(amount);
  balance.lastUpdate = event.block.timestamp;

  balance.save();
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  const profileId = event.params.profileId;
  const vaultId = event.params.vaultId;
  const amount = event.params.shares;

  const balance = getBalance(profileId, vaultId);

  balance.amount = balance.amount.minus(amount);
  balance.lastUpdate = event.block.timestamp;

  balance.save();
}
