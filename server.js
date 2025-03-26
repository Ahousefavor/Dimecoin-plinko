const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { getBalance, sendTransaction } = require('./wallet');
const { User, Transaction } = require('./models');

app.use(bodyParser.json());

// Serve Plinko game files
app.use('/game', express.static(path.join(__dirname, 'public/plinko')));

// Route to get user balance
app.get('/balance/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.json({ balance: user.balance });
});

// Route to deposit funds
app.post('/deposit', async (req, res) => {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    user.balance += amount;
    await user.save();
    res.json({ message: 'Deposit successful', newBalance: user.balance });
});

// Route to withdraw funds
app.post('/withdraw', async (req, res) => {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (user.balance >= amount) {
        user.balance -= amount;
        await user.save();
        res.json({ message: 'Withdrawal successful', newBalance: user.balance });
    } else {
        res.status(400).json({ message: 'Insufficient balance' });
    }
});

// Route to get house balance
app.get('/house/balance', async (req, res) => {
    const houseBalance = await getBalance(); // Call to Dimecoin wallet API
    res.json({ houseBalance });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
