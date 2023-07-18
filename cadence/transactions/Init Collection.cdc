/// This transaction is what an account would run
/// to set itself up to receive NFTs

import NonFungibleToken from 0x01
import PrivateNFT from  0xdf37aa208c406ec8
import MetadataViews from 0x03

transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&PrivateNFT.Collection>(from: PrivateNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- PrivateNFT.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: PrivateNFT.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, PrivateNFT.PrivateNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            PrivateNFT.CollectionPublicPath,
            target: PrivateNFT.CollectionStoragePath
        )
    }

      execute {
    log("User has set up collection")
  }
}