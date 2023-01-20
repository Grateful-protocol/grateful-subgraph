import {
  FundsDeposited,
  FundsWithdrawn,
} from "../generated/FundsModule/FundsModule";
import { handleBalanceAmountChange } from "./balances";

export function handleFundsDeposited(event: FundsDeposited): void {
  const profileId = event.params.profileId;
  const vaultId = event.params.vaultId;
  const amount = event.params.shares;
  handleBalanceAmountChange(event, profileId, vaultId, amount);
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  const profileId = event.params.profileId;
  const vaultId = event.params.vaultId;
  const amount = event.params.shares.neg();
  handleBalanceAmountChange(event, profileId, vaultId, amount);
}
