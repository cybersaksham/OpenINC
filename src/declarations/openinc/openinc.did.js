export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'completePurchase' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'getCanisterID' : IDL.Func([], [IDL.Principal], ['query']),
    'getListedNFTs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getNFTByOwner' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getOriginalOwner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'isListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
