import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWallet(accounts[0]);
  }

  async function payFee() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = "YOUR_CONTRACT_ADDRESS";
    const abi = ["function generateImage(uint256) payable"];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    await contract.generateImage(0, { value: ethers.parseEther("0.0002") });
    alert("Fee paid. Now generating image...");
  }

  async function generateImage() {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("promptId", "testPrompt");

    const res = await axios.post("http://localhost:4000/generate", formData);
    setResult(res.data.output);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Image Generator (Web3)</h1>

      {!wallet && <button onClick={connectWallet}>Connect Wallet</button>}
      {wallet && <p>Connected: {wallet}</p>}

      <br /><br />

      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {preview && (
        <div>
          <p>Preview:</p>
          <img src={preview} width="200" />
        </div>
      )}

      <br />

      <button onClick={payFee}>Pay Fee</button>
      <button onClick={generateImage}>Generate Image</button>

      {result && (
        <div>
          <p>Generated Image:</p>
          <img src={result} width="300" />
        </div>
      )}
    </div>
  );
}
