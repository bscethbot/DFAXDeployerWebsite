import React from 'react'
import styles from "../styles/NftGallery.module.css";
import { ethers } from "ethers";
import axios from "axios";

function SubmitConfigButton({signPayload,setStatus}) {
// if signpayload object is empty
    

  async function signAndPostPayload(signPayload,setStatus) {
    if (!window.ethereum) {
        console.log("MetaMask not detected!");
        setStatus("MetaMask not detected!");
        return;
      }
    // Sign the payload
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer=provider.getSigner();
    // const payloadHash = ethers.utils.hashMessage();
    let signature
    
    try{
     signature = await signer.signMessage(JSON.stringify(signPayload, null, 0));}
    catch(e){

        console.log(e)
    }
    const { r, s, v } = ethers.utils.splitSignature(signature);
      
    // Prepare the data to send
    const postData = {
      method: "fax_submitTokenInfo",
      params: [
        {
          signature: { r, s, v },
          ...signPayload,
        },
      ],
      id: 1,
      jsonrpc: "2.0",
    };
    const rpcUrl='http://5.189.139.168:3000/json-rpc'
    // Send the POST request
    try {
      const response = await axios.post(rpcUrl, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log(response.data);
    } catch (error) {
      console.error("Error sending the POST request:", error);
    }
  }
    
  return (
    <button className={`${Object.keys(signPayload).length === 0 ? styles.buttondisabled :styles.button}`} onClick={()=>signAndPostPayload(signPayload,setStatus)}>List on Website</button>
 
  )
}

export default SubmitConfigButton