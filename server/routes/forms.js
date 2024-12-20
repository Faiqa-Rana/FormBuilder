// const express = require('express');
// const { Form, Response } = require('../Forms/Form');
// const router = express.Router();

// router.post('/create', async (req, res) => {
//   try {
//     const newForm = new Form(req.body);
//     await newForm.save();
//     res.status(201).json(newForm);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const form = await Form.findById(req.params.id);
//     res.status(200).json(form);
//   } catch (error) {
//     res.status(404).json({ error: 'Form not found' });
//   }
// });

// router.post('/:id/response', async (req, res) => {
//   try {
//     const newResponse = new Response({ formId: req.params.id, answers: req.body.answers });
//     await newResponse.save();
//     res.status(201).json(newResponse);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const { Form, Response } = require('../Forms/Form');
const router = express.Router();

// Route to create a new form
router.post('/create', async (req, res) => {
  try {
    const newForm = new Form(req.body);
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch a specific form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.status(200).json(form);
  } catch (error) {
    res.status(404).json({ error: 'Form not found' });
  }
});

// Route to fetch all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to submit responses to a form
router.post('/:id/response', async (req, res) => {
  try {
    const newResponse = new Response({ formId: req.params.id, answers: req.body.answers });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
