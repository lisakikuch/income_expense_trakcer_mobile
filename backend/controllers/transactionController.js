const Transaction = require("../models/transactionModel");

exports.createTransaction = async (req, res) => {
  const { userID, type, amount, category, date, note } = req.body;

  try {
    if (!userID || !type || !category || !date) {
      return res.status(400).json({ message: "All fields need to be filled" });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a numeric value greater than 0" });
    }

    const transaction = new Transaction({
      userID,
      type,
      amount: Number(amount),
      category,
      date,
      note,
    });
    await transaction.save();

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, month } = req.query;
    let filter = {};

    if (type) {
      filter.type = type;
    }

    if (month) {
      const regex = new RegExp(`-${month.padStart(2, "0")}-`);
      filter.date = { $regex: regex, $options: "i" };
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json(updateTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
