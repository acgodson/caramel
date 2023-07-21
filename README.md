# Welcome to Caramel. 
## Traceable and Verifiable distribution of NFTs

> Mint and send private  NFTs such as medical imaging on Flow Blockchain for licensed data consumers or recipients.


👉 Jump to [Video Demo ](https://youtu.be/dY4oADpLZ1s) 


## Caramel Workflow

- [x] [Desktop/Hard Wallet]() -- > Recipient
- [x] [Web dAPP]() -- > Publisher or Sender
- [ ] [JS service]() -- > Developer SDK

![flow](caramel_web/public/flow.png)

1. Sender: Enter recipient's wallet or email  or userID, and upload the image.
2. Sender: Upload image.
3. System: Create or look up the account and retrieve the recipient's public key.
4. System: Retrieve the public key.
5. System: Encrypt the image and upload it to IPFS.
6. System: Mint NFT.
7. Caramel: Validate the recipient's email.
8. Caramel: Combine the recipient's and Caramel's key shares to reconstruct the private key.
9. Recipient: Decrypt the image with the private key.
10. Recipient: Display the decrypted image.


## Flow Blockchain            

| Feature                            | Flow Blockchain                                | Ethereum                                |
|------------------------------------|-----------------------------------------------|----------------------------------------|
| Account Model                      | User-centric, and stores any number of contracts within in named form.       | Ethereum accounts follow the externally owned account (EOA) model.                                                                                       |
| Programming Language           | Cadence, designed for resource-oriented development, faster smart contract development and improved on-chain utility.            | Solidity is the primary language used in Ethereum smart contracts.                                                                                              |
| Scalability                            | Flow's unique sharded architecture enables higher throughput and scalability especially for large minting.       | Ethereum faces scalability challenges, leading to network congestion during peak usage.                                                                                                     |
| Gas Fees                              | Flow's gas model uses transaction fees based on computation complexity, making it more predictable and cost-effective for users.  | Ethereum uses a gas fee model that can be volatile, especially during periods of network congestion, resulting in higher fees.                                                                   |
| Consensus Algorithm         | Flow uses a flavour the HotStuff consensus algorithm, ensuring faster block confirmation times.        | Ethereum currently employs a Proof-of-Work (PoW) consensus algorithm, resource-intensive.                                             |
| NFT Standard                      | Flow has its own standard for Non-Fungible Tokens (NFTs) and an on-chain metadata view-resolver providing ease and flexibility in token creation and tracking.   | Ethereum uses the ERC-721 and ERC-1155 standards for NFTs, offering a wide range of tokens |                                                         |
| Environmental Impact         | Flow's Proof-of-Stake (PoS) mechanism consumes significantly less energy compared to Ethereum's PoW, making it more environmentally friendly. | Ethereum's PoW consensus consumes substantial amounts of energy, leading to environmental concerns.                                                                                                       |
| Ecosystem Growth               | Flow has a growing ecosystem with partnerships in the entertainment, gaming, and NFT spaces with brands like NBA, NFL, Instagram...          | Ethereum's ecosystem is well-established and has the first-mover advantage in the blockchain space.                                                                                                               |






## Contributors
@acgodson


## Links
- [Youtube](https://youtu.be/dY4oADpLZ1s)
- [Drive]()
- [Caramel MacOS]()


## References
- [Flow Developer Docs]()
- [Flutter for macos]()