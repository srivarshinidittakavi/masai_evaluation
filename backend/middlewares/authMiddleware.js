import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, balance')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        res.status(401);
        throw new Error('Not authorized');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};