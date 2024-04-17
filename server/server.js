const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const inventoryRoutes = require('./routes/inventoryRoutes');
const bakeryRoutes = require('./routes/bakeryRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 


const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect('mongodb://localhost:27017/inventory_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json("hello");
  });

app.use('/api/inventory', inventoryRoutes);

app.use('/api/bakery',bakeryRoutes);

app.use('/api/order', orderRoutes);

//app.use('/api/order',orderRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
