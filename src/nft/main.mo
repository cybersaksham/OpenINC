import Principal "mo:base/Principal";

actor class NFT (name : Text, owner : Principal, content : [Nat8]) {
    let itemName : Text = name;
    let nftOwner : Principal = owner;
    let imageBytes : [Nat8] = content;

    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getAsset() : async [Nat8] {
        return imageBytes;
    };
};