import {
  crypto,
  BigInt,
  Bytes,
  ethereum,
  Address,
} from "@graphprotocol/graph-ts";
import {
  AllPermissionsRevoked,
  PermissionGranted,
  PermissionRevoked,
  ProfileCreated,
} from "../generated/ProfilesModule/ProfilesModule";
import { Transfer } from "../generated/GratefulProfile/GratefulProfile";
import { ProfilePermission, Profile } from "../generated/schema";

export function handleProfileCreated(event: ProfileCreated): void {
  const profileId = event.params.profileId;

  const profile = new Profile(profileId);
  profile.owner = event.params.owner;
  profile.salt = event.params.salt;
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

  const encoded = ethereum.encode(
    ethereum.Value.fromFixedSizedArray(tupleArray)
  )!;

  const profileId = crypto.keccak256(encoded);

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

function getPermission(profileId: Bytes, user: Bytes): ProfilePermission {
  const permissionId = profileId.concat(user);
  let permission = ProfilePermission.load(permissionId);

  if (permission == null) {
    permission = new ProfilePermission(permissionId);
    permission.profile = profileId;
    permission.user = user;
    permission.permissions = [];
  }

  return permission;
}

export function handlePermissionGranted(event: PermissionGranted): void {
  const permission = getPermission(event.params.profileId, event.params.user);

  const newPermissions = permission.permissions;
  newPermissions.push(event.params.permission);
  permission.permissions = newPermissions;

  permission.save();
}

export function handlePermissionRevoked(event: PermissionRevoked): void {
  const permission = getPermission(event.params.profileId, event.params.user);

  const newPermissions = permission.permissions;
  let indexToDelete = newPermissions.indexOf(event.params.permission);

  if (indexToDelete > -1) {
    newPermissions.splice(indexToDelete, 1);
  }

  permission.permissions = newPermissions;

  permission.save();
}

export function handlehandleAllPermissionsRevoked(
  event: AllPermissionsRevoked
): void {
  const permission = getPermission(event.params.profileId, event.params.user);

  permission.permissions = [];

  permission.save();
}
