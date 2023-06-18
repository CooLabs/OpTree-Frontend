export const OPTREE_PROXY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "derivedNFTImpl",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "lensHubProxy",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "BurnExpiredOneWeek",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CannotInitImplementation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DerivedRuleModuleNotWhitelisted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EmergencyAdminJustCanPause",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InitParamsInvalid",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Initialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotCollectionOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotGovernance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotGovernanceOrEmergencyAdmin",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotProfileOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Paused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RoyaltyTooHigh",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "_maxRoyalty",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_opTreeHubProfileId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_opTreeHubRoyaltyAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_opTreeHubRoyaltyRercentage",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_state",
    "outputs": [
      {
        "internalType": "enum OpTreeDataTypes.OpTreeState",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "collectionId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nftInfoURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "derivedFrom",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "derivedModuleData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "collectModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "collectModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct OpTreeDataTypes.CreateNewNFTData",
        "name": "vars",
        "type": "tuple"
      }
    ],
    "name": "commitNewNFTIntoCollection",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "collectionId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nftInfoURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "derivedFrom",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "derivedModuleData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32[]",
            "name": "proof",
            "type": "bytes32[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "collectModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "collectModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct OpTreeDataTypes.CreateNewNFTData",
        "name": "vars",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct DataTypes.EIP712Signature",
        "name": "sig",
        "type": "tuple"
      }
    ],
    "name": "commitNewNFTIntoCollectionWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royalty",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "collInfoURI",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "collName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "collSymbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "derivedRuleModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "derivedRuleModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "collectModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "collectModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct OpTreeDataTypes.CreateNewCollectionData",
        "name": "vars",
        "type": "tuple"
      }
    ],
    "name": "createNewCollection",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "royalty",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "collInfoURI",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "collName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "collSymbol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "derivedRuleModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "derivedRuleModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "collectModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "collectModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct OpTreeDataTypes.CreateNewCollectionData",
        "name": "vars",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct DataTypes.EIP712Signature",
        "name": "sig",
        "type": "tuple"
      }
    ],
    "name": "createNewCollectionWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDerivedNFTImpl",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getState",
    "outputs": [
      {
        "internalType": "enum OpTreeDataTypes.OpTreeState",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newGovernance",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "collectionId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "internalType": "struct OpTreeDataTypes.LimitBurnToken",
        "name": "vars",
        "type": "tuple"
      }
    ],
    "name": "limitBurnTokenByCollectionOwner",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newEmergencyAdmin",
        "type": "address"
      }
    ],
    "name": "setEmergencyAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newGovernance",
        "type": "address"
      }
    ],
    "name": "setGovernance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "maxRoyalty",
        "type": "uint256"
      }
    ],
    "name": "setMaxRoyalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "opTreeHubProfileId",
        "type": "uint256"
      }
    ],
    "name": "setOpTreeHubProfileId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newRoyaltyAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "newRoyaltyRercentage",
        "type": "uint256"
      }
    ],
    "name": "setOpTreeHubRoyalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum OpTreeDataTypes.OpTreeState",
        "name": "newState",
        "type": "uint8"
      }
    ],
    "name": "setState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "derviedModule",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "whitelist",
        "type": "bool"
      }
    ],
    "name": "whitelistDerviedModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
