import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask not installed");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWallet(accounts[0]);
  }

  async function payFee() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const abi = ["function generateImage(uint256) payable"];

      const contract = new ethers.Contract(contractAddress, abi, signer);

      await contract.generateImage(0, { value: ethers.parseEther("0.0002") });
      alert("Payment successful! Now generating image...");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  }

  async function generateImage() {
    if (!image) return alert("Upload an image first");

    const form = new FormData();
    form.append("image", image);

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setResult(data.url);
    setLoading(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h1>AI Image Generator (Web3 + GPT)</h1>

      {!wallet && <button onClick={connectWallet}>Connect Wallet</button>}
      {wallet && <p>Connected: {wallet}</p>}

      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImage(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <p>Preview:</p>
          <img src={preview} width="250" />
        </div>
      )}

      <br />

      <button onClick={payFee} style={{ marginRight: 10 }}>Pay Fee</button>
      <button onClick={generateImage}>Generate Image</button>

      {loading && <p>Processing image... please wait.</p>}

      {result && (
        <div style={{ marginTop: 30 }}>
          <p>Generated Image:</p>
          <img src={result} width="300" />
        </div>
      )}
    </div>
  );
}
