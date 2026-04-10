const express = require('express');
const {
  getTree,
  replaceTree,
  addPartnerToFamily,
  addChildToFamily,
  renamePerson,
  deleteBranch,
  deletePartner
} = require('../controllers/treeController');

const router = express.Router();

router.get('/:userId', getTree);
router.put('/:userId', replaceTree);
router.post('/:userId/families/:familyId/partner', addPartnerToFamily);
router.post('/:userId/families/:familyId/children', addChildToFamily);
router.patch('/:userId/people/:personId', renamePerson);
router.delete('/:userId/families/:familyId', deleteBranch);
router.delete('/:userId/families/:familyId/partner', deletePartner);

module.exports = router;
