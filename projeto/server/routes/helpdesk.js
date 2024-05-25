const express = require('express');
const router = express.Router();
const { gethelpdesk, addHelpdesk, updateHelpdesk} = require('../controllers/helpdeskController');

router.get('/', gethelpdesk);
router.post('/', addHelpdesk);
router.put('/:id', updateHelpdesk);


module.exports = router;