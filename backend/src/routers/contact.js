const Contact = require('../controllers/contacts')
const { Router } = require('express')
const router = Router()

router.get("/contacts", Contact.GET)
router.get("/contacts/categories", Contact.GetCategories)

router.post('/contacts/search', Contact.SELECT)
router.delete("/contacts", Contact.DELETE)
router.delete("/categories", Contact.DeleteCategories)
router.post("/contacts", Contact.POST)
router.post("/categories", Contact.PostCategories)
router.put("/contacts", Contact.UPDATE)
router.put("/categories", Contact.UpdateCategories)



module.exports = router