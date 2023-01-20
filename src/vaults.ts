import { VaultAdded } from "../generated/VaultsModule/VaultsModule";
import { Vault } from "../generated/schema";

export function handleVaultAdded(event: VaultAdded): void {
  const vault = new Vault(event.params.id);
  vault.address = event.params.impl;
  vault.save();
}
