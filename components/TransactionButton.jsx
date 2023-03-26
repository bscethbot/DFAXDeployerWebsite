import { ethers } from "ethers";
import styles from "../styles/NftGallery.module.css";

const checkContractAddress = async (provider, contractAddress) => {
  // chainid from provider



  const chain=provider._network.chainId

  console.log(provider)

  if (!provider) {
    console.error(`Provider not found for chain: ${chain}`);
    return false;
  }

  try {
    console.log(`checking contract address ${contractAddress} on chain ${chain}`)
    const bytecode = await provider.getCode(contractAddress);
    return bytecode !== '0x';
  } catch (error) {
    console.error(`Error checking contract address on chain ${chain}: ${error.message}`);
    return false;
  }
};

const monitorContractAddresses = (
  providerDict,
  chains,
  contractaddresses,
  setIsDeployedByChain,
  setStatus
) => {
  return new Promise((resolve) => {
    const intervalIds = {};
    let clearedIntervals = 0;

    for (const [index, chain] of chains.entries()) {
      intervalIds[chain] = setInterval(async () => {
        const contractAddress = contractaddresses[index];
        const provider = providerDict[chain];
        console.log('check on' + chain)
      
        const exists = await checkContractAddress(provider, contractAddress);

        if (exists) {
          console.log(
            `Contract address ${contractAddress} exists on chain ${chain}`
          );
          setIsDeployedByChain((prevState) => ({
            ...prevState,
            [chain]: exists,
          }));

          clearInterval(intervalIds[chain]);
          clearedIntervals += 1;

          if (clearedIntervals === chains.length) {
            console.log("no more intervals");
            setStatus(
              "All Chains Deployed. Refer to the table below for deployed information. You can also click on the 'List on Website' button to list your token on the website."
            );
            resolve(true);
          }
        }
      }, 1000);
    }

  
  });
};






function TransactionButton({providerDict,chain,tokenaddress,deployeraddress,salt,destchainInfo,computedAddress,setStatus,isDeployedByChain,setIsDeployedByChain,setSignPayload}) {
  
  const allparams=[providerDict,chain,tokenaddress,deployeraddress,salt,destchainInfo,computedAddress,setStatus,isDeployedByChain,setIsDeployedByChain,setSignPayload]

  async function sendTransaction(providerDict,chain,tokenaddress,deployeraddress,salt,destchainInfo,computedAddress,setStatus,isDeployedByChain,setIsDeployedByChain,setSignPayload) {
  // compare chain selected and current chain
  // if same chain then send transaction
  // else show error

  // if there are repeating chains then show error

  let allchains =   destchainInfo.map(destChainInfoItem => destChainInfoItem[0]);
  let alldestchains=destchainInfo.map(destChainInfoItem => destChainInfoItem[0]);
  allchains.unshift(chain);
  console.log('all chains are')
  console.log(allchains)
  let uniqueChains = [...new Set(allchains)];
  if (allchains.length !== uniqueChains.length) {
    alert("Please select uniquely different chains");
    return;
  }

  console.log('send Transaction')
  console.log(chain,tokenaddress,deployeraddress,salt)
  console.log('chain is')
  console.log(chain)
  console.log(tokenaddress)

      // check if window.ethereum is available
  if (!window.ethereum) {
          console.log("MetaMask not detected!");
          setStatus("MetaMask not detected!");
          return;
        }

  // const chainvalue=chain['chain']
  const chainIds = {
      ETHGOERLI: "5",
      BNBTEST: "97",
      FTMTEST: "4002",
      AVAXTEST: "43113"
    };


  // factory based on anycall
  const factory = {
    "BNBTEST": "0x142726ACE295FcA5b27f0B9f6986157a19FA41F0",
    "ETHGOERLI": "0x142726ACE295FcA5b27f0B9f6986157a19FA41F0",
    "FTMTEST":"0x142726ACE295FcA5b27f0B9f6986157a19FA41F0",
    "AVAXTEST":"0x142726ACE295FcA5b27f0B9f6986157a19FA41F0"
  }

  


  // get current address
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  
  // get current window eth chain id
  const chainId = await window.ethereum.request({ method: "eth_chainId" });

  // make it normal
  const chainIdDecimal = parseInt(chainId, 16).toString();

  const selectedChainId = chainIds[chain];


  // compare chain selected and current chain
  if (chainIdDecimal !== selectedChainId) {
      alert("Please switch to the correct network");
      console.log(`You selected ${selectedChainId} but you are on ${chainIdDecimal}`)
      return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const erc20ABI = [
    // Add the ERC20 ABI here, or import it from a separate file
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const erccontract = new ethers.Contract(tokenaddress, erc20ABI, provider);
  
  let tokenname, symbol, decimals;

  try{
  // testerc20 0x8C68ad9e912cE8E86D7c95DBAc90E4c79d8c017E
   [tokenname, symbol, decimals] = await Promise.all([
    erccontract.name(),
    erccontract.symbol(),
    erccontract.decimals()
      ]);}
  catch(error){
    console.log(error)
    alert("Please enter a valid token address");
    return;
  }
  
  const tokenData = {
        name: tokenname,
        symbol: symbol,
        decimals: decimals,
        owner: deployeraddress,
        salt: salt
      };

  const factoryaddress = factory[chain]
  console.log('factory address is ' + factoryaddress)
  const bridefactoryabi=[
    {
      "type": "function",
      "name": "createAndSetPeers",
      "inputs": [
        {
          "name": "token",
          "type": "address"
        },
        {
          "name": "tokenData",
          "type": "tuple",
          "components": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "symbol",
              "type": "string"
            },
            {
              "name": "decimals",
              "type": "uint8"
            },
            {
              "name": "owner",
              "type": "address"
            },
            {
              "name": "salt",
              "type": "uint256"
            }
          ]
        },
        {
          "name": "_chainIds",
          "type": "uint256[]"
        },
        {
          "name": "_peers",
          "type": "address[]"
        },
        {
          "name": "anyCallFee",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "payable"
    }
  ]
  

  const signer = provider.getSigner();
  const factorycontract = new ethers.Contract(factoryaddress, bridefactoryabi, signer);

  // _peers is the computedAddress from chain
  var _peers = alldestchains.map((chain) => {
      return computedAddress[chain][0];
    });
  

  // alldestchains add source chain at the start
  // alldestchains.unshift(chain);

  const _chainIds = allchains.map((chain) => {
    return chainIds[chain];
  });



  // anycall fee to 0.01ether to all chains making an array here


  const anyCallFee = _chainIds.map((chain) => {
    return ethers.utils.parseEther("0.02");
  });

  // total fee is 0.01 ether * number of chains time chain number with 0.01 ether
  const totalFee = ethers.utils.parseEther("0.02").mul(_chainIds.length);

  // add the poolgateway at the front
  _peers.unshift(computedAddress[chain][1]);

  


  


//   function createAndSetPeers(
//     address token,
//     TokenData memory tokenData,
//     uint256[] calldata _chainIds,
//     address[] calldata _peers,
//     uint256[] calldata anyCallFee


// )




  // log chainids and peers
  console.log('chain ids and peers')
  console.log(_chainIds);
  console.log(_peers);

  // create a new ethers.js signer using the provider

  console.log('tx info')
  // build tx with the above contract
  console.log([tokenaddress,tokenData,_chainIds,_peers,anyCallFee])



  // send tx with value totalFee set status if they reject
  let tx
  try{
   tx = await factorycontract.createAndSetPeers(tokenaddress,tokenData,_chainIds,_peers,anyCallFee, { value: totalFee });
  }
  catch(error){
    console.log(error.message)

    if (error.message.includes('insufficient funds for gas * price + value')) {
    setStatus("insufficient funds for gas");
  }
    return;
  }
  // if tx successful
  console.log("tx sent");

  // set status to tx sent
  setStatus("Tx Sent. Waiting for tx to be mined... 👇");


  // wait for tx to be mined
  const receipt = await tx.wait();
  console.log(receipt)
  // if tx mined

  console.log("tx mined");

  // get the tx status
  const status = receipt.status;
  
  // if tx status is 1

  if (status === 1) {
    console.log("tx success");
    setStatus("Tx Success. Waiting for other chains to deploy bridges... Check below for deployment status👇");

    console.log('checking if deployed on other chains')
    console.log(_peers)
    const otherchainsuccess=await monitorContractAddresses(providerDict,allchains,_peers,setIsDeployedByChain,setStatus)

    if (otherchainsuccess){
      console.log('all bridges deployed')
      // build out the sign payload
      const projectName=tokenname+"_"+deployeraddress
      let config = {};
      // source chain info
      config[chainIds[chain]] = {
        type: "pool",
        logo: "",
        token: tokenaddress,
        name: tokenname,
        symbol: symbol,
        decimals: decimals,
        gateway: computedAddress[chainId]
      };


      for (const chainId of alldestchains) {
      const gateway = computedAddress[chainId][0];

      config[chainIds[chainId]] = {
        type: "mintburn",
        logo: "",
        token: computedAddress[chainId][2],
        name: tokenname,
        symbol: symbol,
        decimals: decimals,
        gateway: gateway
      };
    }

    // arrange the config in chainid from small to big
    const sortedConfig = {};
    Object.keys(config)
      .sort((a, b) => a - b)
      .forEach((key) => {
        sortedConfig[key] = config[key];
      });
    config = sortedConfig;

    
    console.log('final config')
    console.log(config)
    const signpayload={
      "deployer":deployeraddress,
      "projectName":projectName,
      "configs":config
    }
    console.log('signpayload')
    setSignPayload(signpayload)




  }












}
  console.log(chain,tokenaddress,deployeraddress,salt)
  }
  // computedAddress 
  return (
    <button className={`${computedAddress['BNBTEST']=='' ? styles.buttondisabled :styles.button}`} onClick={()=>sendTransaction(...allparams)}>Deploy Bridges</button>
  );
}

export default TransactionButton;