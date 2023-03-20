import { useState,useEffect } from "react";
import styles from "../styles/NftGallery.module.css";
import { useAccount } from "wagmi";
import TransactionButton from "./TransactionButton";
import { ethers } from "ethers";
import InfoBox from "./InfoBox";



export default function DFAXDeployer({}) {

  const mainnetOptions = [
    { value: "ETH_MAINNET", label: "ETH Mainnet", selected: true },
    { value: "BNB_Chain", label: "BNB Chain", selected: false },
    { value: "MATIC_MAINNET", label: "Polygon", selected: false },
  ];
  
  const testnetOptions = [
    // { value: "ETH_GOERLI", label: "ETH Goerli", selected: false },
    { value: "BNBTEST", label: "BNB Testnet", selected: false },
    { value: "FTMTEST", label: "Fantom Testnet", selected: false },
    { value: "AVAXTEST", label: "Avalanche Testnet", selected: false },
    // { value: "MATIC_MUMBAI", label: "Polygon Mumbai", selected: false },

  ];

  const ifTestnetsupportedChainNumber={
    true:testnetOptions.length-1,
    false:mainnetOptions.length-1}

  console.log(ifTestnetsupportedChainNumber)
  const bsctestrpc='https://data-seed-prebsc-1-s1.binance.org:8545'
  const ethtestrpc='https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  const ftmtestrpc='https://rpc.ankr.com/fantom_testnet'
  const avaxtestrpc='https://api.avax-test.network/ext/bc/C/rpc'

  const bscprovider = new ethers.providers.JsonRpcProvider(bsctestrpc);
  const ethgoerliprovider = new ethers.providers.JsonRpcProvider(ethtestrpc);
  const ftmtestprovider = new ethers.providers.JsonRpcProvider(ftmtestrpc);
  const avaxtestprovider = new ethers.providers.JsonRpcProvider(avaxtestrpc);


  // make a dict with provider
  const providerDict={
    "BNBTEST":bscprovider,
    "ETH_GOERLI":ethgoerliprovider,
    "FTMTEST":ftmtestprovider,
    "AVAXTEST":avaxtestprovider}

  const factory = {
      "BNBTEST": "0x7C00F080732f53e20351fc853AF82d3Bceb36398",
      // "ETH_GOERLI": "0xf45dee55de626e06b9af41fe35917a40b9d491d1",
      "FTMTEST":"0x7C00F080732f53e20351fc853AF82d3Bceb36398",
      "AVAXTEST":"0x7C00F080732f53e20351fc853AF82d3Bceb36398"
    }

  const anycallFactory={
    "BNBTEST": "0x142726ACE295FcA5b27f0B9f6986157a19FA41F0",
    // "ETH_GOERLI": "0x142726ACE295FcA5b27f0B9f6986157a19FA41F0",
    "FTMTEST":"0x142726ACE295FcA5b27f0B9f6986157a19FA41F0",
    "AVAXTEST":"0x142726ACE295FcA5b27f0B9f6986157a19FA41F0"
  }

  const supportedChains=["BNBTEST","FTMTEST","AVAXTEST"]

  const [isTestnet, setIsTestnet] = useState(true);

  // set a array of states containing token address and chain
  const [tokenAddress, setTokenAddress] = useState('');
  const [sourceChainBridge, setSourceChainBridge] = useState('');

  // logo url
  const [logoUrl, setLogoUrl] = useState('');

  // salt
  const [salt, setSalt] = useState('');

  // metamask account
  const { address, isConnected } = useAccount();

  // display status
  const [status, setStatus] = useState('');

  // computed address from salt 
  const [computedAddress, setComputedAddress] = useState(
    supportedChains.reduce((acc, chain) => {
      acc[chain] = '';
      return acc;
    }, {})
  );

  const [chain, setChain] = useState("BNBTEST");


  const [destchainInfo, setDestchainInfo] = useState([["BNBTEST",'']])
  

  // isdeployedbychain
  const [isDeployedByChain, setIsDeployedByChain] = useState(
    supportedChains.reduce((acc, chain) => {
      acc[chain] = false;
      return acc;
    }, {})
  );


  // this function calculates the address of the contracts based on salt
  async function calcDestChainAddresses(owneraddress,chain,salt){
    

  const contractAddress=factory[chain]
  const bridefactoryabi=[
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_anyCallProxy",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "_codeShops",
            "type": "address[]"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "contractType",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "contractAddress",
            "type": "address"
          }
        ],
        "name": "Create",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "previousAdminRole",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "newAdminRole",
            "type": "bytes32"
          }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleGranted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleRevoked",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name_",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol_",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "decimals_",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "createBridgeToken",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "createMintBurnGateway",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "createPoolGateway",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name_",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol_",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "decimals_",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "createTokenAndMintBurnGateway",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "getBridgeTokenAddress",
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
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "getMintBurnGatewayAddress",
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
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "salt",
            "type": "uint256"
          }
        ],
        "name": "getPoolGatewayAddress",
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
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          }
        ],
        "name": "getRoleAdmin",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "hasRole",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  
  // get provider
  const provider=providerDict[chain]
  
  
  //build contract by ethers
  const contract = new ethers.Contract(contractAddress, bridefactoryabi, provider);
  
  
  const [tokenAddress, gatewayAddress, poolGatewayAddress] = await Promise.all([
    contract.getBridgeTokenAddress(owneraddress, salt),
    contract.getMintBurnGatewayAddress(owneraddress, salt),
    contract.getPoolGatewayAddress(owneraddress, salt),
  ]);
  return [gatewayAddress,poolGatewayAddress,tokenAddress]
  }


  // calculate the addresses once the source chain token address is provided
  useEffect(() => {

    // if token address is correct fomat

    console.log('useeffect for token address loaded')
      
    // random salt
    const salt = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

    setSalt(salt)
    const updateComputedAddress = async () => {
      const updatedAddress = {};
      for (const [chain, valueaddress] of Object.entries(computedAddress)) {
        console.log(chain)
        
        const destChainTokenAddress = await calcDestChainAddresses(anycallFactory[chain], chain,salt);
        updatedAddress[chain] = destChainTokenAddress;
      }

      setComputedAddress(updatedAddress);
    };
    updateComputedAddress();
  
  
  }, []);

  const [startedDeploy, setstartedDeploy] = useState(false)

  useEffect(() => {

    // get localstorage starteddeploy
    const localstartedDeploy = JSON.parse(localStorage.getItem('startedDeploy'));
    if (localstartedDeploy) {
      setstartedDeploy(localstartedDeploy);
    }
      

  }, []);
  

  // store started deploy in localstorage to keep track of status in case of refresh (building...)
  useEffect(() => {

    localStorage.setItem('startedDeploy', JSON.stringify(startedDeploy));
  }, [startedDeploy]);
  

  function ChainSelect({ chain, setChain ,isTestnet}) {
    return (
      
        !isTestnet?
      <select
        value={chain}
        onChange={(e) => {
          setChain(e.target.value);
        }}
      >
        <option value={"ETH_MAINNET"}>ETH Mainnet</option>
        <option value={"BNB_Chain"}>BNB Chain</option>
        <option value={"MATIC_MAINNET"}>Polygon</option>

      </select>:
      <select
      value={chain}
      onChange={(e) => {
        setChain(e.target.value);
      }}
    >


      <option value={"AVAXTEST"}>Avalanche Testnet</option>
      <option value={"BNBTEST"}>BNB Testnet</option>
      <option value={"FTMTEST"}>Fantom Testnet</option>
    </select>

      
    );
}

  
function DestChainForm({ isTestnet, destchainInfo, setDestchainInfo }) {

  // const mainnetOptions = [
  //   { value: "ETH_MAINNET", label: "ETH Mainnet", selected: true },
  //   { value: "BNB_Chain", label: "BNB Chain", selected: false },
  //   { value: "MATIC_MAINNET", label: "Polygon", selected: false },
  // ];
  
  // const testnetOptions = [
  //   { value: "ETH_GOERLI", label: "ETH Goerli", selected: false },
  //   { value: "BNBTEST", label: "BNB Testnet", selected: false },
  //   { value: "MATIC_MUMBAI", label: "Polygon Mumbai", selected: false },

  // ];

  const chainOptions = isTestnet ? testnetOptions : mainnetOptions;
  return (
    
    destchainInfo.map((chainInfo,index) => (
    <div className={styles.input_button_container}>
      {/* <input
        value={chainInfo[1]}
        onChange={(e) => {
          const newDestchainInfo = [...destchainInfo];
          newDestchainInfo[index][1] = e.target.value;
          setDestchainInfo(newDestchainInfo);
        }}
        placeholder="Destination Chain Token Address"
      ></input> */}
    <div className={styles.text_container}>Dest Chain Token Address {index+1} (Computed): {computedAddress[chainInfo[0]]}
    </div>
      

        <select
        value={chainInfo[0]}
          onChange={(e) => {
            const newDestchainInfo = [...destchainInfo];
            newDestchainInfo[index][0] = e.target.value;
            setDestchainInfo(newDestchainInfo);
          }}
        >
          {chainOptions.map((option) => (
            <option key={option.value} value={option.value} selected={option.selected}>
              {option.label}
            </option>
          ))}
        </select>
     
    </div>
      )
    )
  )
}



  return (
    <div>
    <div className={styles.nft_gallery}>
      <div className={styles.inputs_container}>
        {/* a display message introducing the product */}
        <div className={styles.message_container}>
          <h1>Permissionless Bridge Deployer</h1>


          <p>
            Deploy your own bridge between chains. (Powered by anyCall)
            This assumes you have only deployed your erc20 token on one chain and wish to expand to other chains.

            

            <br></br>
          </p>

          {/* bold */}
          <p>
            <b>Simply enter your token address and the destination chains and click deploy. Only 1 tx is needed to set up the whole bridge.</b>
          </p>
        </div>
        {/*  source token */}
        <div className={styles.input_button_container}>
          <input
            value={tokenAddress}
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
            placeholder="Source Chain Token Address"
          ></input>

          <ChainSelect chain={chain} setChain={setChain} isTestnet={isTestnet}/>
        </div>

        <div className={styles.logo_container}>
          <input
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
            }}
            placeholder="TOKEN LOGO URL"
          ></input>

        </div>
        



        {/*  destination token */}

        {/* render according to destchainInfo */}



       <DestChainForm isTestnet={isTestnet} destchainInfo={destchainInfo} setDestchainInfo={setDestchainInfo}/>

            {/* a add button that add a array into  destchainInfo to make it longer*/}
            <button
            
            

              className={styles.button}
              onClick={() => {

                // if length is smaller than the length of chainOptions
                if(destchainInfo.length<ifTestnetsupportedChainNumber[isTestnet]){
                setDestchainInfo([...destchainInfo,["BNBTEST",'']])
                }
                else{
                  alert("You can only add up to "+ifTestnetsupportedChainNumber[isTestnet]+" destination chains"
                  )
                }
              }}
            >


            + Add Destination Chain 
</button>
            {/* button that change destchaininfo array to default  */}
            {/* <button
              className={styles.button}
              onClick={() => {
                setDestchainInfo([["MATIC_MUMBAI",'']])
              }}
            >Reset Destination Chains
</button> */}

        {/* Testnet? */}
        <div className={styles.radios_container}>
          <label>
            <input
              checked={isTestnet}
              onChange={(e) => {
                setIsTestnet(e.target.checked);
              }}
              type={"radio"}
            ></input>
            Testnets
          </label>

        
          <label>
            <input
              type={"radio"}
              checked={0}

              onChange={(e) => {
                // setIsTestnet(!e.target.checked);
              }
            
            }
            ></input>
            Mainnets
          </label>
        </div>
        {/* (chain,tokenaddress,deployeraddress,salt) */}
        
        {/* if theres repeating source chain and destchain */}


        <TransactionButton providerDict={providerDict} setStatus={setStatus}  chain={chain} deployeraddress={address} tokenaddress={tokenAddress} salt={salt} destchainInfo={destchainInfo} computedAddress={computedAddress} isDeployedByChain={isDeployedByChain} setIsDeployedByChain={setIsDeployedByChain}/ >
        
        {/* status */}
        <div className={`${styles.status} ${status.includes('...') ? styles.flashingeffect : ''}`}>

          
          <p>
           {status}
          </p>
        </div>
      </div>

    </div>

    <div>
    <InfoBox isDeployedByChain={isDeployedByChain} chain={chain} computedAddress={computedAddress} sourceChainBridge={sourceChainBridge} tokenAddress={tokenAddress} destchainInfo={destchainInfo}/>
    </div>
    </div>
  );
}

