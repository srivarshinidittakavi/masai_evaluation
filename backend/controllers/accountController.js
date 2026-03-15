import supabase from '../config/supabaseClient.js';

export const getBalance = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStatement = async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        transaction_type,
        created_at,
        sender:sender_id(name, id),
        receiver:receiver_id(name, id)
      `)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const formattedTransactions = transactions.map(transaction => {
      let type, from, to;
      
      if (transaction.sender.id === req.user.id) {
        type = 'Debit';
        from = 'You';
        to = transaction.receiver.name;
      } else {
        type = 'Credit';
        from = transaction.sender.name;
        to = 'You';
      }

      return {
        id: transaction.id,
        date: transaction.created_at,
        type: type,
        amount: transaction.amount,
        from: from,
        to: to
      };
    });

    res.json(formattedTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const transferMoney = async (req, res) => {
  try {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user.id;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('*')
      .eq('id', senderId)
      .single();

    if (senderError) {
      return res.status(400).json({ message: 'Sender not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('*')
      .eq('email', receiverEmail)
      .single();

    if (receiverError || !receiver) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    if (receiver.id === senderId) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    const { error: transactionError } = await supabase.rpc('transfer_money', {
      sender_id_param: senderId,
      receiver_id_param: receiver.id,
      amount_param: amount
    });

    if (transactionError) {
      return res.status(400).json({ message: transactionError.message });
    }

    const { data: updatedSender } = await supabase
      .from('users')
      .select('balance')
      .eq('id', senderId)
      .single();

    res.json({ 
      message: 'Transfer successful', 
      newBalance: updatedSender.balance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email')
      .neq('id', req.user.id);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};