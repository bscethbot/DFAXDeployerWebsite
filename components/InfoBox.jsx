import React from 'react'
import styles from "../styles/NftGallery.module.css";

function InfoBox({chain,sourceChainBridge,tokenAddress,destchainInfo,computedAddress,isDeployedByChain}) {
  // if computedaddress isnt calculated yet show nothing
  if(computedAddress['BNBTEST']=='') return null;


  return (
        <div className={styles.nft_gallery}> 
        <div className={styles.message_container}>
             <h1>Address Information Card</h1>
             <p>
               This card would store the addresses of all your deployed bridges and tokens.
             </p>
   
             {/* a table */}
             <table className={styles.info_table}>
  <thead>
    <tr>
      <th scope="col">Source Chain</th>
      <th scope="col">Bridge Address (Computed)</th>
      <th scope="col">Token Address</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{chain}</td>
      <td>{computedAddress[chain][1]} (Deployed {(isDeployedByChain[chain]?'✔️':'❌')})</td>
      <td>{tokenAddress}</td>
    </tr>
    <tr>
      <th scope="row">Dest Chains </th>
      <td>Bridge Address (Computed)</td>
      <td>Token Address (Computed)</td>
    </tr>
    {destchainInfo.map((chainInfo,index) => (

<React.Fragment key={index}>
<tr>
  <td>{chainInfo[0]}</td>

      {/* mint gateway destchain */}
  <td>{computedAddress[chainInfo[0]][0]} (Deployed {(isDeployedByChain[chainInfo[0]]?'✔️':'❌')})</td>


  {/* token address dest chain */}
  <td>{computedAddress[chainInfo[0]][2]} (Deployed {(isDeployedByChain[chainInfo[0]]?'✔️':'❌')})</td>
</tr>
{/* {computedAddress[chainInfo[0]] ? (
  <tr>
    <td>Deployed</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
) : null} */}
</React.Fragment>

      


       
      

      
      
      

    ))}
  </tbody>
</table>
           </div>
        
        </div>
  )
}

export default InfoBox