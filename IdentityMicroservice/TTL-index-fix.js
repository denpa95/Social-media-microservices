require("dotenv").config();
const mongoose = require("mongoose");
const RefreshToken = require("./src/models/refreshToken");

(async function fixIndex() {
  try {
    //Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    //Drop "expiresAt" index and recreate indexes
    await RefreshToken.collection.dropIndex("expiresAt_1");
    await RefreshToken.createIndexes();
    //Get back indexes to check if selected index has been deleted
    const indexes = await RefreshToken.collection.indexes();
    console.log(indexes);
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
