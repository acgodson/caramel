
import NonFungibleToken from 0x631e88ae7f1d7c20
import PrivateNFT from  0xdf37aa208c406ec8
import MetadataViews from 0x631e88ae7f1d7c20

transaction {

    prepare(signer: AuthAccount) {
        if signer.borrow<&PrivateNFT.Collection>(from: PrivateNFT.CollectionStoragePath) != nil {
            return
        }

        let collection <- PrivateNFT.createEmptyCollection()

        signer.save(<-collection, to: PrivateNFT.CollectionStoragePath)

        signer.link<&{NonFungibleToken.CollectionPublic, PrivateNFT.PrivateNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            PrivateNFT.CollectionPublicPath,
            target: PrivateNFT.CollectionStoragePath
        )
    }

      execute {
    log("User has set up collection")
  }
}