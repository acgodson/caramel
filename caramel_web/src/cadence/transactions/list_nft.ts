export const list_nft = `import NonFungibleToken from 0x01
import MedicalNFT from 0x02
import NFTTransfer from 0x04

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {

let transferPool = acct.borrow<&NFTTransfer.TransferPool>(from: /storage/TransferPool)
                       ?? panic("This pool does not exist ")

transferPool.addForTransfer(nftID: id, address: acct.address)
  
  }
  execute {
    log("A user listed an NFT for transfer")
  }
}
`;
