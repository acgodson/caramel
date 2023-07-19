export const getLength = `import NonFungibleToken from 0x631e88ae7f1d7c20
import PrivateNFT from 0xdf37aa208c406ec8

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account
        .getCapability(PrivateNFT.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs().length
}`