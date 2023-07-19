export const get_userNFTs = `import NonFungibleToken from 0x631e88ae7f1d7c20
import MedicalNFT from 0xdf37aa208c406ec8


pub fun main(account: Address): [&MedicalNFT.NFT] {
  let collection = getAccount(account).getCapability(/public/MedicalNFTCollection)
  .borrow<&MedicalNFT.Collection{NonFungibleToken.CollectionPublic, MedicalNFT.CollectionPublic}>()
  ?? panic ("can't get the user's collection")

  let returnVals: [&MedicalNFT.NFT]  = []

  let ids = collection.getIDs()
  for id in ids {
  returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return  returnVals
}
`;
