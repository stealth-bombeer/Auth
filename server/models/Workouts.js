const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  load: {
    type: Number,
    required: true,
  },
  user_id: { 
    type:String,
    required: true,
  },
});

const Workout = mongoose.model("workout", workoutSchema);
module.exports = Workout;





