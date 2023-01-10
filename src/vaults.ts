import { VaultAdded } from "../generated/VaultsModule/VaultsModule";
import { Vault } from "../generated/schema";

export function handleVaultAdded(event: VaultAdded): void {
  let vault = new Vault(event.params.id);
  vault.save();
}
