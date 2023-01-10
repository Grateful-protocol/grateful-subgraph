import { FundsDeposited } from "../generated/FundsModule/FundsModule";
import { Profile, Balance } from "../generated/schema";

export function handleFundsDeposited(event: FundsDeposited): void {
  const profileId = event.params.profileId;
  const vaultId = event.params.vaultId;
  const amount = event.params.shares;

  const balanceId = profileId.concat(vaultId);
  let balance = Balance.load(balanceId);
  if (balance == null) {
    balance = new Balance(balanceId);
    balance.vault = vaultId;
    balance.profile = profileId;
  }

  balance.amount = balance.amount.plus(amount);
  balance.lastUpdate = event.block.timestamp;

  balance.save();
}
