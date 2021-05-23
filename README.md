# Apperture

## Getting started

Open the root folder in two terminals

💻 Terminal 1

```bash
cd frontend/
```

```bash
npm install
```

```bash
npm run dev
```

💻 Terminal 2

```bash
cd backend/
```

```bash
npm install
```

Inside the `backend/` folder create a new `.env` file.

Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | What You’ll Need:

- A MongoDB account
- An Atlas Cluster
- A MongoDB User

Obtain your MongoDB connection string, it should looks something like this:

```bash
mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
```

Now in the `.env` file type `MONGO_DB=` followed by your connection string.

```
MONGO_DB= ...
```

Now you're ready to go!

```bash
npm run dev
```
