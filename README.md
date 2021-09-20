# Apperture

School assignment • group project by Jack, Marijune, Padma, Robin and Victoria

## About

A Progressive Web Application surrounding photos where users can capture and upload images, browse other users' pictures and chat privately or in a group about a certain topic.

## Screenshots

<div>
<img src="https://user-images.githubusercontent.com/72305598/134035850-f103c88f-348d-4775-93ed-230484368442.png" width="49%">
<img src="https://user-images.githubusercontent.com/72305598/134035845-c1febdb0-4bc1-40c2-9a82-7b348a4875f6.png" width="49%">
</div>

## Setup

```bash
# Terminal 1 (frontend)

cd frontend/
npm install
npm run dev
```

```bash
# Terminal 2 (backend)

cd backend/
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
# Terminal 2 (backend)

npm run dev
```
