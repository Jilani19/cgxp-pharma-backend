const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Fetch pharma contacts
 *     description: |
 *       Fetch all contacts from the database.
 *       Supports optional query parameters for limit and search.
 *       Client-side pagination is handled by AG Grid on the frontend.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 100
 *         description: Limit number of records returned
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: Pfizer
 *         description: Search by name or company
 *     responses:
 *       200:
 *         description: Contacts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 500
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const { limit, search } = req.query;

    let query = {};

    // Optional search by name or company
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
        ],
      };
    }

    let dbQuery = Contact.find(query);

    // Optional limit
    if (limit) {
      dbQuery = dbQuery.limit(Number(limit));
    }

    const contacts = await dbQuery.lean();

    res.json({
      success: true,
      total: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     tags:
 *       - Contacts
 *     summary: Update a contact (inline edit)
 *     description: |
 *       Updates one or more fields of a contact.
 *       Used by AG Grid inline edit functionality.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the contact
 *         schema:
 *           type: string
 *           example: 64f1c8a9a2e4c1b9d1234567
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               company: Pfizer
 *               email: john.doe@pfizer.com
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: No update data provided
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact",
    });
  }
});

module.exports = router;
