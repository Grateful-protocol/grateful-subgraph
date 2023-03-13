import {
  crypto,
  log,
  BigInt,
  Bytes,
  ethereum,
  Address,
} from "@graphprotocol/graph-ts";
import { ProfileCreated } from "../generated/ProfilesModule/ProfilesModule";
import { Transfer } from "../generated/GratefulProfile/GratefulProfile";
import { Profile } from "../generated/schema";

export function handleProfileCreated(event: ProfileCreated): void {
  const profileId = event.params.profileId;

  const profile = new Profile(profileId);
  profile.owner = event.params.owner;
  profile.address = event.params.profileAddress;
  profile.tokenId = event.params.tokenId;
  profile.subscriptions = BigInt.fromI32(0);
  profile.subscribers = BigInt.fromI32(0);

  profile.save();
}

function getProfileId(profileAddress: Address, tokenId: BigInt): Bytes {
  const tupleArray: Array<ethereum.Value> = [
    ethereum.Value.fromAddress(profileAddress),
    ethereum.Value.fromUnsignedBigInt(tokenId),
  ];
  const tuple = tupleArray as ethereum.Tuple;
  const encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!;
  const profileId = crypto.keccak256(encoded);

  log.debug("PROFILE ID: {}", [profileId.toString()]);

  return Bytes.fromByteArray(profileId);
}

export function handleProfileTransfer(event: Transfer): void {
  const profileId = getProfileId(event.address, event.params.tokenId);

  const profile = Profile.load(profileId);

  if (profile != null) {
    profile.owner = event.params.to;
    profile.save();
  }
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
