const express = require("express");
const mongoose = require("mongoose");
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
 *       Supports optional query parameters for limit, search, and sort.
 *       Client-side pagination is handled by AG Grid.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Pfizer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: company
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
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const search = req.query.search || "";
    const sort = req.query.sort || "createdAt";

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: `^${search}`, $options: "i" } },
          { company: { $regex: `^${search}`, $options: "i" } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      Contact.find(query)
        .select("name title level company email phone") // 👈 IMPORTANT
        .sort({ [sort]: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Contact.countDocuments(query),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     tags:
 *       - Contacts
 *     summary: Update a contact (inline edit)
 *     description: Updates editable fields of a contact.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Invalid input
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID",
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // Allow only safe editable fields
    const allowedFields = [
      "name",
      "title",
      "level",
      "company",
      "email",
      "phone",
      "linkedin",
      "email_check_status",
      "linkedin_check_status",
    ];

    const safeUpdates = {};
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        safeUpdates[field] = updates[field];
      }
    });

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: safeUpdates },
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
