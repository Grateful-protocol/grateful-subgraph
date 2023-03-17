# Subgraph Schema

This subgraph schema defines the entities and fields used in a liquidity management system.

## Profile

`Profile` is an entity type that represents a user profile. It has the following fields:

- `id`: A required field of type `Bytes` that serves as the unique identifier for each `Profile` entity. (`profileId` from contracts)
- `owner`: A required field of type `Bytes` that represents the owner of the profile.
- `address`: A required field of type `Bytes` that represents the Ethereum address associated with the profile NFT.
- `tokenId`: A required field of type `BigInt` that represents the unique identifier of a token associated with the profile.
- `subscriptions`: A required field of type `BigInt` that represents the number of subscriptions associated with the profile.
- `subscribers`: A required field of type `BigInt` that represents the number of subscribers associated with the profile.

## Vault

`Vault` is an entity type that represents a ERC4626 vault. It has the following fields:

- `id`: A required field of type `Bytes` that serves as the unique identifier for each `Vault` entity. (It is the vault name)
- `address`: A required field of type `Bytes` that represents the Ethereum address associated with the vault.
- `minRate`: A required field of type `BigInt` that represents the minimum subscription rate for the vault.
- `maxRate`: A required field of type `BigInt` that represents the maximum subscription rate for the vault.
- `paused`: A required field of type `Boolean` that indicates whether the vault is currently paused.

## Balance

`Balance` is an entity type that represents the balance of a profile within a vault. It has the following fields:

- `id`: A required field of type `Bytes` that serves as the unique identifier for each `Balance` entity.
- `vault`: A required field of type `Vault` that represents the ERC4626 vault associated with the balance.
- `profile`: A required field of type `Profile` that represents the user profile associated with the balance.
- `amount`: A required field of type `BigInt` that represents the amount of funds currently held in the balance.
- `flow`: A required field of type `BigInt` that represents the flow of funds in and out of the balance.
- `inflow`: A required field of type `BigInt` that represents the total inflow of funds into the balance.
- `outflow`: A required field of type `BigInt` that represents the total outflow of funds from the balance.
- `lastUpdate`: A required field of type `BigInt` that represents the timestamp of the last update to the balance.
- `liquidationTime`: An optional field of type `BigInt` that represents the timestamp of the liquidation time for the balance.

## GratefulSubscription

`GratefulSubscription` is an entity type that represents a subscription to a creator by a giver. It has the following fields:

- `id`: A required field of type `ID` that serves as the unique identifier for each `GratefulSubscription` entity. (The token ID from the Subscription NFT)
- `giver`: A required field of type `Profile` that represents the user profile of the giver.
- `creator`: A required field of type `Profile` that represents the user profile of the creator.
- `vault`: A required field of type `Vault` that represents the ERC4626 vault associated with the subscription.
- `rate`: A required field of type `BigInt` that represents the rate associated with the subscription.
- `feeRate`: A required field of type `BigInt` that represents the fee rate associated with the subscription.
- `lastUpdate`: A required field of type `BigInt` that represents the timestamp of the last update to the subscription.
