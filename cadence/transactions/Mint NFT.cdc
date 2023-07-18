/// This script uses the NFTMinter resource to mint a new NFT
/// It must be run with the account that has the minter resource
/// stored in /storage/NFTMinter

import NonFungibleToken from 0x631e88ae7f1d7c20
import PrivateNFT from 0xdf37aa208c406ec8
import MetadataViews from 0x631e88ae7f1d7c20


transaction(
    recipient: Address,
    name: String,
    thumbnail: String,
    description: String,
    hash: String,
) {

    /// local variable for storing the minter reference
    let minter: &PrivateNFT.NFTMinter

    /// Reference to the receiver's collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    /// Previous NFT ID before the transaction executes
    let mintingIDBefore: UInt64

    prepare(signer: AuthAccount) {
        self.mintingIDBefore = PrivateNFT.totalSupply

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&PrivateNFT.NFTMinter>(from: PrivateNFT.MinterStoragePath)
            ?? panic("Account does not store an object at the specified path")

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(PrivateNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
    }

    execute {


        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: self.recipientCollectionRef,
            name: name,
            thumbnail: thumbnail,
            description: description,
            hash: hash
        )
    }

    post {
        self.recipientCollectionRef.getIDs().contains(self.mintingIDBefore): "The next NFT ID should have been minted and delivered"
        PrivateNFT.totalSupply == self.mintingIDBefore + 1: "The total supply should have been increased by 1"
    }
}