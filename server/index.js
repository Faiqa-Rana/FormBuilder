// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error.message);
//   });

//   const formRoutes = require('./routes/forms');
//   app.use('/api/forms', formRoutes);
  
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();
// const app = express();

// // Allow all origins or specific origins if needed (e.g., 'http://localhost:3000')
// app.use(cors({
//   origin: 'http://localhost:3000', // Adjust as necessary
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type'],
// }));

// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error.message);
//   });

// const formRoutes = require('./routes/forms');
// app.use('/api/forms', formRoutes);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Allow multiple origins by passing an array
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8081']; // List all your frontend origins

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

const formRoutes = require('./routes/forms');
app.use('/api/forms', formRoutes);
