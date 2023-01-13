import { Transfer } from "../generated/GratefulProfile/GratefulProfile";
import { ProfilesModule } from "../generated/GratefulProfile/ProfilesModule";
import { Profile } from "../generated/schema";

export function handleProfileMinted(event: Transfer): void {
  const receipt = event.receipt;

  if (receipt) {
    const profileAddress = receipt.contractAddress;
    const tokenId = event.params.tokenId;

    const contract = ProfilesModule.bind(profileAddress);
    const profileId = contract.getProfileId(profileAddress, tokenId);

    let profile = Profile.load(profileId);

    if (profile == null) {
      profile = new Profile(profileId);
    }

    profile.owner = event.params.to;

    profile.save();
  }
}
