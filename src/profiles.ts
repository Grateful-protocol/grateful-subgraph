import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/GratefulProfile/GratefulProfile";
import { ProfilesModule } from "../generated/GratefulProfile/ProfilesModule";
import { Profile } from "../generated/schema";

export function handleProfileMinted(event: Transfer): void {
  const profileAddress = event.address;
  const tokenId = event.params.tokenId;

  const address = Address.fromString(
    "0xCa1CbC0b702146924E1B7e607CA9eB33beF759ad"
  ); // @audit not hardcoded address

  const contract = ProfilesModule.bind(address);

  const profileId = contract.getProfileId(profileAddress, tokenId);

  let profile = Profile.load(profileId);

  if (profile == null) {
    profile = new Profile(profileId);
  }

  profile.owner = event.params.to;

  profile.save();
}
