export const store_share_pool = `import NonFungibleToken from 0x631e88ae7f1d7c20
import MedicalNFT from 0xdf37aa208c406ec8
import NFTTransfer from 0xdf37aa208c406ec8

transaction {

  prepare(acct: AuthAccount) {

  let NFTCollection = acct.getCapability<&MedicalNFT.Collection>(/public/MedicalNFTCollection)

  acct.save(<- NFTTransfer.createTransferPool(medicalNFTCollection: NFTCollection) , to: /storage/TransferPool)
  acct.link<&NFTTransfer.TransferPool>(/public/TransferPool, target: /storage/TransferPool)

  
  }
  execute {
    log("A user stored a transfer pool inside their account")
  }
}
`