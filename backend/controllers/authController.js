import bcrypt from 'bcryptjs';
import supabase from '../config/supabaseClient.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  try {
    console.log('Signup request body:', req.body); // Add this for debugging
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking user:', checkError);
      return res.status(400).json({ message: checkError.message });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          balance: 10000
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return res.status(400).json({ message: error.message });
    }

    console.log('User created successfully:', newUser.id);
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      balance: newUser.balance,
      token: generateToken(newUser.id)
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log('Login request body:', req.body); // Add this for debugging
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error finding user:', error);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User logged in successfully:', user.id);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};