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

// API route to play the game
app.post('/api/play', (req, res) => {
    const { betAmount } = req.body;

    if (betAmount > 0 && wallet.deductBet(betAmount)) {
        // Proceed to game logic
        const rewardMultiplier = Math.random() * 5; // Example random multiplier (modify for buckets)
        const reward = betAmount * rewardMultiplier;

        wallet.addReward(reward); // Update wallet with reward
        res.json({ reward, newBalance: wallet.getBalance() });
    } else {
        res.status(400).json({ error: 'Insufficient funds or invalid bet!' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
