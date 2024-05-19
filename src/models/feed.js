import mongoose from "mongoose";

const FeedSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  message: String,
  image: String,
  likes: [
    {
      reactorUserId: String,
      reactorUserName: String,
    },
  ],
});

const Feed = mongoose.models.Feed || mongoose.model("Feed", FeedSchema);
export default Feed;
