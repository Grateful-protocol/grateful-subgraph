import { Bytes } from "@graphprotocol/graph-ts";
import {
  FundsDeposited,
  FundsWithdrawn,
} from "../generated/FundsModule/FundsModule";
import { Balance } from "../generated/schema";

function getBalance(profileId: Bytes, vaultId: Bytes): Balance {
  const balanceId = profileId.concat(vaultId);
  let balance = Balance.load(balanceId);

  if (balance == null) {
    balance = new Balance(balanceId);
    balance.profile = profileId;
    balance.vault = vaultId;
  }

  return balance;
}

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
