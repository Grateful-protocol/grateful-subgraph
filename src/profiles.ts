import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/GratefulProfile/GratefulProfile";
import { ProfilesModule } from "../generated/GratefulProfile/ProfilesModule";
import { Profile } from "../generated/schema";

export function handleProfileMinted(event: Transfer): void {
  const profileAddress = event.address;
  const tokenId = event.params.tokenId;

  const address = Address.fromString(
    "0x9F0F29b4B1C559EaC6ADB8e5d75172B3ec6b825e"
  ); // @audit not hardcoded address

  const contract = ProfilesModule.bind(address);

  const profileId = contract.getProfileId(profileAddress, tokenId);

  let profile = Profile.load(profileId);

  if (profile == null) {
    profile = new Profile(profileId);
    profile.address = profileAddress;
    profile.tokenId = tokenId;
    profile.subscriptions = BigInt.fromI32(0);
    profile.subscribers = BigInt.fromI32(0);
  }

  profile.owner = event.params.to;

  profile.save();
}

export function handleProfileSubscriptionsChange(
  profileId: Bytes,
  quantity: BigInt
): void {
  const profile = Profile.load(profileId);
  if (profile) {
    profile.subscriptions = profile.subscriptions.plus(quantity);
    profile.save();
  }
}

export function handleProfileSubscribersChange(
  profileId: Bytes,
  quantity: BigInt
): void {
  const profile = Profile.load(profileId);
  if (profile) {
    profile.subscribers = profile.subscribers.plus(quantity);
    profile.save();
  }
}
