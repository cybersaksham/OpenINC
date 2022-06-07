import Cycles "mo:base/ExperimentalCycles";
import NFTActor "../nft/main";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor OpenINC {
    private type Listing = {
        itemOwner : Principal;
        itemPrice : Nat;
    };

    var mapOfNFTs = HashMap.HashMap<Principal, NFTActor.NFT>(1, Principal.equal, Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

    public shared(msg) func mint(name : Text, imgData : [Nat8]) : async Principal {
        let owner : Principal = msg.caller;

        Cycles.add(100_500_000_000); // To create canister it require 100B cycles

        let newNFT = await NFTActor.NFT(name, owner, imgData);
        let newNFTPrincipal = await newNFT.getCanisterId();

        mapOfNFTs.put(newNFTPrincipal, newNFT);
        addOwnership(owner, newNFTPrincipal);

        return newNFTPrincipal;
    };

    public shared(msg) func listItem(id : Principal, price : Nat) : async Text {
        var item : NFTActor.NFT = switch (mapOfNFTs.get(id)) {
            case null return "NFT does not exists.";
            case (?result) result;
        };

        let owner = await item.getOwner();
        
        if(Principal.equal(owner, msg.caller)) {
            let newListing : Listing = {
                itemOwner = owner;
                itemPrice = price;
            };
            mapOfListings.put(id, newListing);
            return "Success";
        } else {
            "You don't own this NFT.";
        }
    };

    public shared(msg) func completePurchase(id : Principal, newOwner : Principal) : async Text {
        var reqNFT : NFTActor.NFT = switch (mapOfNFTs.get(id)) {
            case null return "NFT does not exists.";
            case (?result) result;
        };
        
        let transferResult = await reqNFT.transfer(newOwner);

        if(transferResult == "Success") {
            let orgOwner : Principal = await getOriginalOwner(id);
            mapOfListings.delete(id);

            var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(orgOwner)) {
                case null List.nil<Principal>();
                case(?result) result;
            };

            ownedNFTs := List.filter(ownedNFTs, func (itemID : Principal) : Bool {
                return itemID != id;
            });
            mapOfOwners.put(orgOwner, ownedNFTs);

            addOwnership(newOwner, id);

            return "Success";
        } else {
            return "Error";
        }
    };

    public query func getNFTByOwner(owner : Principal) : async [Principal] {
        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
            case null List.nil<Principal>();
            case(?result) result;
        };
        return List.toArray(ownedNFTs);
    };

    public query func getListedNFTs() : async [Principal] {
        let ids = Iter.toArray(mapOfListings.keys());
        return ids;
    };

    public query func getOriginalOwner(id : Principal) : async Principal {
        var listing : Listing = switch (mapOfListings.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };

        return listing.itemOwner;
    };

    public query func getPrice(id : Principal) : async Nat {
        var listing : Listing = switch (mapOfListings.get(id)) {
            case null return 0;
            case (?result) result;
        };

        return listing.itemPrice;
    };    

    public query func getCanisterID() : async Principal {
        return Principal.fromActor(OpenINC);
    };

    public query func isListed(id : Principal) : async Bool {
        if(mapOfListings.get(id) == null) {
            return false;
        } else {
            return true;
        }
    };

    private func addOwnership(ownerId : Principal, nftId : Principal) {
        var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(ownerId)) {
            case null List.nil<Principal>();
            case(?result) result;
        };
        ownedNFTs := List.push(nftId, ownedNFTs);
        mapOfOwners.put(ownerId, ownedNFTs);
    };
};