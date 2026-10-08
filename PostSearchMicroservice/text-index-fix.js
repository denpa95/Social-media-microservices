require("dotenv").config();
const mongoose = require("mongoose");
const Search = require("./src/model/search");

//This is a script to fix the Search schema that filters "stop-word" words such as "This", "is", "my", etc. To fix this, existing text index have to dropped first, and recreated with the option {default_language: "none"} to stop MongoDB from filtering stop-words.

(async function dropCurrentIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    //Drop existing text index
    await Search.collection.dropIndex("content_text");
    //Recreate indexes, now include default_language option
    await Search.createIndexes()
    //Check if new index has been created
    const indexes = await Search.collection.indexes();
    console.log(indexes);
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  } finally {
    //Close connection with MongoDB
    await mongoose.disconnect();
  }
})();
