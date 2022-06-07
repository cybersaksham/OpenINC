import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'completePurchase' : (arg_0: Principal, arg_1: Principal) => Promise<string>,
  'getCanisterID' : () => Promise<Principal>,
  'getListedNFTs' : () => Promise<Array<Principal>>,
  'getNFTByOwner' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getOriginalOwner' : (arg_0: Principal) => Promise<Principal>,
  'getPrice' : (arg_0: Principal) => Promise<bigint>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: string, arg_1: Array<number>) => Promise<Principal>,
}
