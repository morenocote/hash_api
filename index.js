// hashing-service/index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3300;
app.use(express.json());
// Función auxiliar para encriptar
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Reemplazar $2a$ por $2y$ para compatibilidad con PHP si es necesario
    return hash.replace('$2a$', '$2y$');
}

app.post('/hash', async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const finalHash = await hashPassword(password);
        res.json({ hash: finalHash });
    } catch (error) {
        res.status(500).json({ error: 'Hashing failed' });
    }
});

app.get('/:password', async (req, res) => {
    const { password } = req.params;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const finalHash = await hashPassword(password);
        res.json({ hash: finalHash });
    } catch (error) {
        res.status(500).json({ error: 'Hashing failed' });
    }
});

app.listen(port, () => {
    console.log(`Hashing service listening at http://localhost:${port}`);
});