import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Balance } from "../generated/schema";

export function getBalance(profileId: Bytes, vaultId: Bytes): Balance {
  const balanceId = profileId.concat(vaultId);
  let balance = Balance.load(balanceId);

  if (balance == null) {
    balance = new Balance(balanceId);
    balance.profile = profileId;
    balance.vault = vaultId;
    balance.amount = new BigInt(0);
    balance.flow = new BigInt(0);
  }

  return balance;
}
