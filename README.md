This is a minimal example of how to token-gate VR Next.js page using [Lit Protocol](https://developer.litprotocol.com/) using `getServerSideProps`.


This token gates a `/protected` page checking to see if the user has a [Good Faith Paradigm](https://etherscan.io/address/0xd07dc4262BCDbf85190C01c996b4C06a461d2430) ERC1155 `token #490643`.

To run this example:

1. Clone the repo and install dependencies

```sh
git clone git@github.com:dabit3/nextjs-lit-token-gating.git

cd nextjs-lit-token-gating

npm install
```

2. Update the `accessControlConditions` with the contract address of the NFT you'd like to use:

```javascript
const accessControlConditions = [
  {
    contractAddress: '0xd07dc4262BCDbf85190C01c996b4C06a461d2430',
    standardContractType: 'ERC1155',
    chain: 'ethereum',
    method: 'balanceOf',
    parameters: [
      ':userAddress',
      '490643'
    ],
    returnValueTest: {
      comparator: '>',
      value: '0'
    }
  }
]
```

3. Start the app

```sh
npm run dev
```