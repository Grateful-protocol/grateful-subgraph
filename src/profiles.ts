import { Address } from "@graphprotocol/graph-ts";
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
  }

  profile.owner = event.params.to;

  profile.save();
}