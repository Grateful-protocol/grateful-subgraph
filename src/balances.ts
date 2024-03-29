import { BigInt, Bytes, ethereum, crypto } from "@graphprotocol/graph-ts";
import { Balance } from "../generated/schema";
import { BalancesModule } from "../generated/SubscriptionsModule/BalancesModule";

function getBalanceId(profileId: Bytes, vaultId: Bytes): Bytes {
  const tupleArray: Array<ethereum.Value> = [
    ethereum.Value.fromBytes(profileId),
    ethereum.Value.fromBytes(vaultId),
  ];

  const encoded = ethereum.encode(
    ethereum.Value.fromFixedSizedArray(tupleArray)
  )!;

  const balanceId = crypto.keccak256(encoded);

  return Bytes.fromByteArray(balanceId);
}

export function getBalance(profileId: Bytes, vaultId: Bytes): Balance {
  const balanceId = getBalanceId(profileId, vaultId);
  let balance = Balance.load(balanceId);

  if (balance == null) {
    balance = new Balance(balanceId);
    balance.profile = profileId;
    balance.vault = vaultId;
    balance.amount = BigInt.fromI32(0);
    balance.flow = BigInt.fromI32(0);
    balance.inflow = BigInt.fromI32(0);
    balance.outflow = BigInt.fromI32(0);
  }

  return balance;
}

function getLiquidationTime(
  event: ethereum.Event,
  remainingTime: BigInt
): BigInt | null {
  if (remainingTime.isZero()) return null;

  const LIQUIDATION_START_TIME = BigInt.fromI32(259200);

  return event.block.timestamp
    .plus(remainingTime)
    .minus(LIQUIDATION_START_TIME);
}

export function handleBalanceAmountChange(
  event: ethereum.Event,
  profileId: Bytes,
  vaultId: Bytes,
  amount: BigInt
): void {
  const balance = getBalance(profileId, vaultId);

  const contract = BalancesModule.bind(event.address);
  const currentData = contract.getBalanceCurrentData(profileId, vaultId);
  const currentBalance = currentData.getCurrentBalance();
  const remainingTime = currentData.getTimeLeft();

  balance.amount = currentBalance;
  balance.liquidationTime = getLiquidationTime(event, remainingTime);
  balance.lastUpdate = event.block.timestamp;

  balance.save();
}

export function handleBalanceFlowChange(
  event: ethereum.Event,
  profileId: Bytes,
  vaultId: Bytes,
  flow: BigInt
): void {
  const balance = getBalance(profileId, vaultId);

  const contract = BalancesModule.bind(event.address);
  const currentData = contract.getBalanceCurrentData(profileId, vaultId);
  const currentBalance = currentData.getCurrentBalance();
  const remainingTime = currentData.getTimeLeft();

  balance.amount = currentBalance;
  balance.flow = balance.flow.plus(flow);
  balance.liquidationTime = getLiquidationTime(event, remainingTime);
  balance.lastUpdate = event.block.timestamp;

  balance.save();
}

export function handleBalanceInflowChange(
  profileId: Bytes,
  vaultId: Bytes,
  inflow: BigInt
): void {
  const balance = getBalance(profileId, vaultId);
  balance.inflow = balance.inflow.plus(inflow);
  balance.save();
}

export function handleBalanceOutflowChange(
  profileId: Bytes,
  vaultId: Bytes,
  outflow: BigInt
): void {
  const balance = getBalance(profileId, vaultId);
  balance.outflow = balance.outflow.plus(outflow);
  balance.save();
}
