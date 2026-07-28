import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

router.post('/', async (req, res) => {
  const { fullName, email, phone, location, source, message } = req.body;

  if (!fullName || !email || !phone || !location || !source || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const { error } = await supabase.from('enquiries').insert({
    full_name: fullName,
    email,
    phone,
    location,
    source,
    message,
  });

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Database Error: ' + error.message,
    });
  }

  res.json({
    success: true,
    message: 'Enquiry Submitted Successfully',
  });
});

export default router;
