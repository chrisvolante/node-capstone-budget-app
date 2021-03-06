// Imports Transaction mongoose schema model from transactions.model.js file.
const { Transaction } = require('./transactions.model');
// Imports HTTP_STATUS_CODES from config.js file.
const { HTTP_STATUS_CODES } = require('../config');

// CREATES new transaction.
exports.createNewTransaction = (request, response) => {
  // Stores user's transaction information.
  const newTransaction = {
    user: request.user.id,
    payee: request.body.payee,
    amount: request.body.amount,
    budgetsCategory: request.body.budgetsCategory,
    accountsName: request.body.accountsName,
    createDate: Date.now()
  };
  
  // Step 1: Validate user's input is correct.
  const requiredFields = ['payee', 'amount', 'budgetsCategory', 'accountsName'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in request.body)) {
      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: "Missing a field." });
    }
  };

  // Step 2: Create new transaction.
  Transaction.create(newTransaction)
    .then(createdTransaction => {
      return response.status(HTTP_STATUS_CODES.CREATED).json(createdTransaction.serialize());
    })
    .catch(error => {
      return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
};

// RETRIEVES user's transactions.
exports.getUserTransactions = (request, response) => {
  // Step 1: Attempt to retrieve all transactions.
  Transaction.find({ user: request.user.id })
    .populate('user', 'name email')
    .then(transactions => {
      // Step 2: Return sanitized transactions.
      return response.status(HTTP_STATUS_CODES.OK).json(
        transactions.map(transaction => transaction.serialize())
      );
    })
    .catch(error => {
      return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
};

// RETRIEVES all transactions.
exports.getAllTransactions = (request, response) => {
  Transaction.find()
    .populate('user')
    .then(transactions => {
      return response.status(HTTP_STATUS_CODES.OK).json(
        transactions.map(transaction => transaction.serialize())
      );
    })
    .catch(error => {
      return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
};

// RETRIEVES one transaction by ID.
exports.getTransactionById = (request, response) => {
  Transaction.findById(request.params.transactionid)
    .populate('user')
    .then(transaction => {
      return response.status(HTTP_STATUS_CODES.OK).json(transaction.serialize());
    })
    .catch(error => {
      return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
};

// UPDATES transaction by ID.
exports.updateTransactionById = (request, response) => {
  const updatedTransaction = {
    payee: request.body.payee,
    amount: request.body.amount,
    budgetsCategory: request.body.budgetsCategory,
    accountsName: request.body.accountsName
  };

  // Step 1: Validate user's input is correct.
  const requiredFields = ['payee', 'amount', 'budgetsCategory', 'accountsName'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in request.body)) {
      return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: "Missing a field" });
    }
  };

  // Step 2: Finds transaction by ID and updates.
  Transaction.findByIdAndUpdate(request.params.transactionid, updatedTransaction)
    .then(() => {
      // Since update was performed we end request with No Content status code.
      return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(error => {
      return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
};

// DELETES transaction by ID.
exports.deleteTransactionById = (request, response) => {
  // Step 1: Finds transaction by ID and removes.
  Transaction.findByIdAndDelete(request.params.transactionid)
    .then(() => {
      // Since deletion was performed we end request with No Content status code.
      return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
    })
    .catch(error => {
      return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
};