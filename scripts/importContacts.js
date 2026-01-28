const mongoose = require("mongoose");
const csv = require("csvtojson");
const Contact = require("../models/Contact");

mongoose.connect("mongodb://127.0.0.1:27017/cgxp_pharma");

async function importData() {
  const contacts = await csv().fromFile("companies_0_500.csv");

  const formatted = contacts.map(c => ({
    externalId: c.id,
    name: c.name,
    photo: c.photo,
    title: c.title,
    level: c.level,
    linkedin: c.linkedin,
    email: c.email,
    phone: c.phone,
    company: c.company,
    unlocked: c.unlocked === "true",
    unlocked_company: c.unlocked_company === "true",
    email_check_status: c.email_check_status,
    email_check_date: c.email_check_date,
    linkedin_check_status: c.linkedin_check_status,
    linkedin_check_date: c.linkedin_check_date,
    created_at: c.created_at,
    updated_at: c.updated_at
  }));

  await Contact.insertMany(formatted);
  console.log("Contacts imported:", formatted.length);
  process.exit();
}

importData();
