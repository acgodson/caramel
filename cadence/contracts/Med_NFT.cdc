
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
import ViewResolver from  0xdf37aa208c406ec8

pub contract PrivateNFT: NonFungibleToken, ViewResolver {

 
    pub var totalSupply: UInt64
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    p

    /// Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath


    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let name: String
        pub let thumbnail: String
        pub let description: String
        pub let hash: String
        access(all) let metadata: {String: AnyStruct}

        init(
            id: UInt64,
            name: String,
            thumbnail: String,
            description: String,
            hash: String,
            metadata: {String: AnyStruct},
        ) {
            self.id = id
            self.name = name
            self.thumbnail = thumbnail
            self.description = description
            self.metadata = metadata
            self.hash = hash
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.thumbnail
                        ),
                        
                    )
                case Type<MetadataViews.Editions>():
                    // There is no max number of NFTs that can be minted from this contract
                    // so the max edition field value is set to nil
                    let editionInfo = MetadataViews.Edition(name: "Medical NFT", number: self.id, max: nil)
                    let editionList: [MetadataViews.Edition] = [editionInfo]
                    return MetadataViews.Editions(
                        editionList
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                    )
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: PrivateNFT.CollectionStoragePath,
                        publicPath: PrivateNFT.CollectionPublicPath,
                        providerPath: /private/PrivateNFTCollection,
                        publicCollection: Type<&PrivateNFT.Collection{PrivateNFT.PrivateNFTCollectionPublic}>(),
                        publicLinkedType: Type<&PrivateNFT.Collection{PrivateNFT.PrivateNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&PrivateNFT.Collection{PrivateNFT.PrivateNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-PrivateNFT.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://assets.caramel-pi.vercel.app/logo.svg"
                        ),
                        mediaType: "image/svg+xml"
                    )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Medical Imaging",
                        description: "confidential",
                        externalURL: MetadataViews.ExternalURL(self.hash),
                        squareImage: media,
                        bannerImage: media,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/caramel")
                        }
                    )
             
            }
            return nil
        }
    }

    pub resource interface PrivateNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowPrivateNFT(id: UInt64): &PrivateNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow PrivateNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: PrivateNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {

        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

       
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @PrivateNFT.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowPrivateNFT(id: UInt64): &PrivateNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &PrivateNFT.NFT
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let PrivateNFT = nft as! &PrivateNFT.NFT
            return PrivateNFT as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    /// Allows anyone to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource NFTMinter {

        /// Mints a new NFT with a new ID and deposit it in the
        /// recipients collection using their collection reference
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            name: String,
            thumbnail: String,
            description: String,
            hash: String
        ) {
            let metadata: {String: AnyStruct} = {}
            let currentBlock = getCurrentBlock()
            metadata["mintedBlock"] = currentBlock.height
            metadata["mintedTime"] = currentBlock.timestamp
            metadata["minter"] = recipient.owner!.address
            metadata["hash"] = hash
            
            // create a new NFT
            var newNFT <- create NFT(
                id: PrivateNFT.totalSupply,
                name: name,
                thumbnail: thumbnail,
                description: description,
                hash: hash,
                metadata: metadata,
            )

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)

            PrivateNFT.totalSupply = PrivateNFT.totalSupply +  1
        }
    }

    /// Function that resolves a metadata view for this contract.
    ///
    /// @param view: The Type of the desired view.
    /// @return A structure representing the requested view.
    ///
    pub fun resolveView(_ view: Type): AnyStruct? {
        switch view {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: PrivateNFT.CollectionStoragePath,
                    publicPath: PrivateNFT.CollectionPublicPath,
                    providerPath: /private/PrivateNFTCollection,
                    publicCollection: Type<&PrivateNFT.Collection{PrivateNFT.PrivateNFTCollectionPublic}>(),
                    publicLinkedType: Type<&PrivateNFT.Collection{PrivateNFT.PrivateNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                    providerLinkedType: Type<&PrivateNFT.Collection{PrivateNFT.PrivateNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                    createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                        return <-PrivateNFT.createEmptyCollection()
                    })
                )
            case Type<MetadataViews.NFTCollectionDisplay>():
                let media = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(
                 url: "https://assets.caramel-pi.vercel.app/logo.svg"
                    ),
                    mediaType: "image/svg+xml"
                )
                return MetadataViews.NFTCollectionDisplay(
                     name: "Medical Imaging",
                      description: "confidential",
                      externalURL: MetadataViews.ExternalURL("https://assets.caramel-pi.vercel.app/"),
                      squareImage: media,
                      bannerImage: media,
                      socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/caramel")
                        }
                )
        }
        return nil
    }

    /// Function that returns all the Metadata Views implemented by a Non Fungible Token
    ///
    /// @return An array of Types defining the implemented views. This value will be used by
    ///         developers to know which parameter to pass to the resolveView() method.
    ///
    pub fun getViews(): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/PrivateNFTCollection
        self.CollectionPublicPath = /public/PrivateNFTCollection
        self.MinterStoragePath = /storage/PrivateNFTMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // create a public capability for the collection
        self.account.link<&PrivateNFT.Collection{NonFungibleToken.CollectionPublic, PrivateNFT.PrivateNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )
        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}