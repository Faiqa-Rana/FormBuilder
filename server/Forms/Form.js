const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  text: { type: String, required: true },
  options: [String], // for CheckBox and Grid
  image: String,
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  headerImage: String,
  questions: [questionSchema],
});

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [{ questionId: String, answer: mongoose.Schema.Types.Mixed }],
});

const Form = mongoose.model('Form', formSchema);
const Response = mongoose.model('Response', responseSchema);

module.exports = { Form, Response };
