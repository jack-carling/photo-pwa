const port = 5000;

require('dotenv').config();

const { express, app } = require('mongoosy')({
  connect: {
    url: process.env.MONGO_DB,
    useFindAndModify: false,
  },
});

app.use(express.json());

require('./chat')(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
