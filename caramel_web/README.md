## Caramel Plugin



![flow](public/flow.png)

1. Sender: Enter recipient's email or userID and upload the image.
2. Sender: Upload image.
3. System: Create or look up the account and retrieve the recipient's public key.
4. System: Retrieve the public key.
5. System: Encrypt the image and upload it to IPFS.
6. System: Mint NFT.
7. Caramel: Validate the recipient's email.
8. Caramel: Combine the recipient's and Caramel's key shares to reconstruct the private key.
9. Recipient: Decrypt the image with the private key.
10. Recipient: Display the decrypted image.

               
            

Key Storage

users (collection) Access Control (User)
└── userId1 (document)
    ├── email: "user1@example.com"
    ├── connections: ["connectionId1", "connectionId2", ...]
    └── key_share: "..."
    └── other_fields...
    
└── userId2 (document)
    ├── email: "user2@example.com"
    ├── connections: ["connectionId3", "connectionId4", ...]
    └── key_share: "..."
    └── other_fields...


keypairs (collection) Access Control (Platform)
└── userId1 (document)
    ├── public_key: "..."
    └── key_share: "..."
└── userId2 (document)
    ├── public_key: "..."
    └── key_share: "..."

