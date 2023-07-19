export const mintNFT = `import NonFungibleToken from 0x631e88ae7f1d7c20
import PrivateNFT from 0xdf37aa208c406ec8
import MetadataViews from 0x631e88ae7f1d7c20


transaction(
    recipient: Address,
    name: String,
    thumbnail: String,
    description: String,
    hash: String,
) {

    let minter: &PrivateNFT.NFTMinter
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}
    let mintingIDBefore: UInt64

    prepare(signer: AuthAccount) {
        self.mintingIDBefore = PrivateNFT.totalSupply
        self.minter = signer.borrow<&PrivateNFT.NFTMinter>(from: PrivateNFT.MinterStoragePath)
            ?? panic("Account does not store an object at the specified path")
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(PrivateNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")
    }

    execute {
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
}`;
