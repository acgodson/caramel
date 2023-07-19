export const get_userNFTs = `import NonFungibleToken from 0x631e88ae7f1d7c20
import PrivateNFT from  0xdf37aa208c406ec8
import MetadataViews from 0x631e88ae7f1d7c20

pub struct NFTDisplay {
    pub let id: UInt64
    pub let uuid: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionExternalURL: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String

    init(
        id: UInt64,
        uuid: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        collectionName: String,
        collectionDescription: String,
        collectionExternalURL: String,
        collectionSquareImage: String,
        collectionBannerImage: String
    ) {
        self.id = id
        self.uuid = uuid
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionExternalURL = collectionExternalURL
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
    }
}

pub fun main(address: Address): [NFTDisplay] {
    let account = getAccount(address)
    let collectionData: [NFTDisplay] = []

    let collectionRef = account
        .getCapability(PrivateNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection at specified path")

        let collection = account
        .getCapability(PrivateNFT.CollectionPublicPath)
        .borrow<&{MetadataViews.ResolverCollection}>()
        ?? panic("Could not borrow a reference to the collection")
    

    let ids = collectionRef.getIDs()

    for id in ids {
        let viewResolver = collection.borrowViewResolver(id: id)
        let nftView = MetadataViews.getNFTView(id: id, viewResolver: viewResolver)
        let nftViewResult = NFTDisplay(
            id: nftView.id,
            uuid: nftView.uuid,
            name: nftView.display!.name,
            description: nftView.display!.description,
            thumbnail: nftView.display!.thumbnail.uri(),
            collectionName: nftView.collectionDisplay!.name,
            collectionDescription: nftView.collectionDisplay!.description,
            collectionExternalURL: nftView.collectionDisplay!.externalURL.url,
            collectionSquareImage: nftView.collectionDisplay!.squareImage.file.uri(),
            collectionBannerImage: nftView.collectionDisplay!.bannerImage.file.uri()
        )

        collectionData.append( nftViewResult)
    }

    return collectionData
}
`;
