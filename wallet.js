const axios = require('axios');

// Replace with your Dimecoin wallet RPC URL and credentials
const RPC_URL = 'http://localhost:8332';
const RPC_USER = 'your_rpc_user';
const RPC_PASSWORD = 'your_rpc_password';

// Function to get wallet balance
async function getBalance() {
    const response = await axios.post(RPC_URL, {
        jsonrpc: "1.0",
        id: "curltest",
        method: "getbalance",
        params: []
    }, {
        auth: {
            username: RPC_USER,
            password: RPC_PASSWORD
        }
    });
    return response.data.result;
}

// Function to send transaction
async function sendTransaction(address, amount) {
    const response = await axios.post(RPC_URL, {
        jsonrpc: "1.0",
        id: "curltest",
        method: "sendtoaddress",
        params: [address, amount]
    }, {
        auth: {
            username: RPC_USER,
            password: RPC_PASSWORD
        }
    });
    return response.data.result; // Transaction ID
}

module.exports = { getBalance, sendTransaction };
