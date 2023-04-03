import {
  MaxRateChanged,
  MinRateChanged,
  VaultActivated,
  VaultAdded,
  VaultDeprecated,
  VaultPaused,
  VaultUnpaused,
} from "../generated/VaultsModule/VaultsModule";
import { Vault } from "../generated/schema";

export function handleVaultAdded(event: VaultAdded): void {
  const vault = new Vault(event.params.id);
  vault.address = event.params.impl;
  vault.minRate = event.params.minRate;
  vault.maxRate = event.params.maxRate;
  vault.paused = false;
  vault.save();
}

export function handleMinRateChanged(event: MinRateChanged): void {
  const vault = new Vault(event.params.id);
  vault.minRate = event.params.newMinRate;
  vault.save();
}

export function handleMaxRateChanged(event: MaxRateChanged): void {
  const vault = new Vault(event.params.id);
  vault.maxRate = event.params.newMaxRate;
  vault.save();
}

export function handleVaultPaused(event: VaultPaused): void {
  const vault = new Vault(event.params.id);
  vault.paused = true;
  vault.save();
}

export function handleVaultUnpaused(event: VaultUnpaused): void {
  const vault = new Vault(event.params.id);
  vault.paused = false;
  vault.save();
}

export function handleVaultDeprecated(event: VaultDeprecated): void {
  const vault = new Vault(event.params.id);
  vault.deprecated = true;
  vault.save();
}

export function handleVaultActivated(event: VaultActivated): void {
  const vault = new Vault(event.params.id);
  vault.deprecated = false;
  vault.save();
}
