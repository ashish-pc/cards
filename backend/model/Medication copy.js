import mongoose from "mongoose";




const dosageInstructionsSchema = new mongoose.Schema({
  text: String,
  patientInstruction: String,
  start: Date,
  end: Date,
  frequency: Number,
  period: Number,
  periodUnit: String
});

const frequencySchema = new mongoose.Schema({
  id: Number,
  status: String
});

const medicationSchema = new mongoose.Schema({
  id: String,
  med: String,
  Provider: String,
  frequency: [frequencySchema],
  dosageInstructions: dosageInstructionsSchema
});

const Medication = mongoose.model('Medication', medicationSchema);

export {Medication}