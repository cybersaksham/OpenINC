import Cycles "mo:base/ExperimentalCycles";
import NFTActor "../nft/main";
import Principal "mo:base/Principal";

actor OpenINC {
    public shared(msg) func mint(name : Text, imgData : [Nat8]) : async Principal {
        let owner : Principal = msg.caller;

        Cycles.add(100_500_100_100); // To create canister it require 100B cycles

        let newNFT = await NFTActor.NFT(name, owner, imgData);
        let newNFTPrincipal = await newNFT.getCanisterId();

        return newNFTPrincipal;
    };
};