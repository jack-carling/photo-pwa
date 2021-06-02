require('dotenv').config();

const port = 5000;

const { express, app } = require('mongoosy')({
  connect: {
    url: process.env.MONGO_DB,
    useFindAndModify: false,
  },
});

app.use(express.static('static'));

app.use(express.json());

require('./chat')(app);
require('./upload')(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
