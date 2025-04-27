const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const { auth, adminOnly } = require('../middleware/auth');
const { incidentValidation } = require('../middleware/validation');

// GET all incidents with pagination and filtering
router.get('/', auth, incidentValidation.query, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.severity) {
      query.severity = req.query.severity;
    }

    const sort = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.startsWith('-') 
        ? [req.query.sort.slice(1), -1] 
        : [req.query.sort, 1];
      sort[field] = order;
    } else {
      sort.reported_at = -1;
    }

    const [incidents, total] = await Promise.all([
      Incident.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Incident.countDocuments(query)
    ]);

    res.json({
      incidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new incident
router.post('/', auth, incidentValidation.create, async (req, res) => {
  const incident = new Incident({
    title: req.body.title,
    description: req.body.description,
    severity: req.body.severity,
    reported_by: req.user._id
  });

  try {
    const newIncident = await incident.save();
    res.status(201).json(newIncident);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET single incident
router.get('/:id', auth, incidentValidation.id, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE incident (admin only)
router.delete('/:id', auth, adminOnly, incidentValidation.id, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    await incident.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 