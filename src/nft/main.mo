import Principal "mo:base/Principal";

actor class NFT (name : Text, owner : Principal, content : [Nat8]) = this {
    private var itemName : Text = name;
    private var nftOwner : Principal = owner;
    private let imageBytes : [Nat8] = content;

    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getAsset() : async [Nat8] {
        return imageBytes;
    };

    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transfer(newOwner : Principal) : async Text {
        if(Principal.equal(msg.caller, nftOwner)) {
            nftOwner := newOwner;
            return "Success";
        } else {
            return "You don't own this NFT.";
        };
    };
};