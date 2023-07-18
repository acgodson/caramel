import NonFungibleToken from 0x631e88ae7f1d7c20
import MedicalNFT from 0xdf37aa208c406ec8


pub contract NFTTransfer  {

pub var totalSupply: UInt64 

pub resource interface TransferPoolPublic {
pub fun getNFTID(id: UInt64): UInt64?
pub fun getTransfersForAddress(address: Address): [UInt64]?
pub fun receiveNFT(id: UInt64, address: Address, recipientCollection: &MedicalNFT.Collection{NonFungibleToken.CollectionPublic})
}

 
pub resource TransferPool: TransferPoolPublic {
    pub let medicalNFTCollection: Capability<&MedicalNFT.Collection> //senders NFT collection
    pub let transferPool: {UInt64: UInt64} //transferPool Transfer ID --> NFT ID
    pub let users: {Address: [UInt64]} //recievers pool User Address --> [Transfer ID]
   
    access(all) fun isValidAddress (address: Address): Bool {
        let account = getAccount(address)
            return account != nil
    }
        
        init(_medicalNFTCollection: Capability<&MedicalNFT.Collection> ) {
            self.transferPool = {NFTTransfer.totalSupply : 0}
            self.users = {}
            self.medicalNFTCollection = _medicalNFTCollection
        }

    pub fun getNFTID(id: UInt64): UInt64? {
            return self.transferPool[id]
    }

    pub fun getTransfersForAddress(address: Address): [UInt64]? {
            return self.users[address]
    }

    pub fun addForTransfer(nftID: UInt64, address: Address) {
   
    pre {
      self.isValidAddress(address: address): "This address is not a valid address"
     }
    let id = NFTTransfer.totalSupply + 1
    self.transferPool[id] = id
    NFTTransfer.totalSupply = id
    //nftID

    if (self.users[address] == nil) {
        self.users[address] = [nftID]
    } else {
        self.users[address]!.append(nftID)
    }
  }

  pub fun receiveNFT(id: UInt64, address: Address, recipientCollection: &MedicalNFT.Collection{NonFungibleToken.CollectionPublic})  {
   let nftID = self.transferPool[id]
   recipientCollection.deposit(token: <-  self.medicalNFTCollection.borrow()!.withdraw(withdrawID: nftID!))
   //remove the nft from the transferPool and recievers pool
   self.transferPool.remove(key: id)
   //TODO: Remove id from an index in users pool. One way is to reconstruct the array and append again to the same key
  }

}



pub fun createTransferPool(medicalNFTCollection: Capability<&MedicalNFT.Collection>): @TransferPool {
return  <- create TransferPool(_medicalNFTCollection: medicalNFTCollection)
}

  init () {
    self.totalSupply = 1
  }

}