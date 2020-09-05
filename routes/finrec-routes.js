const finRecController = require('../controllers/finrec-controller.js');
const {check} = require('express-validator');
const Security = require('../services/security/security.js');

module.exports = function(app) {
    app.get('/api/health', finRecController.CheckApi);
    app.get('/', Security.isLoggedIn, finRecController.GetHomePage);

    app.get('/transactionType', Security.isLoggedIn, finRecController.GetSelectTransactionTypePage);
    app.get('/transaction/select', Security.isLoggedIn, finRecController.GetSelectTransactionTypePage);
    
    app.post("/transactionType", [ check('transactionType').not().isEmpty().escape().withMessage('Please choose a transaction type') ], Security.isLoggedIn, finRecController.GetTransactionForm);
    app.get('/transaction/detail/:transactionUID', finRecController.GetTransactionDetails);

    app.post('/transaction/deposit', 
    [
        check('transactionTerminal').not().isEmpty().escape().withMessage('Please choose a transaction terminal'),
        check('transactionType').not().isEmpty().escape().withMessage('Please choose a transaction type'),
        check('amountReceived').not().isEmpty().isNumeric().escape().withMessage('Amount received error'),
        check('posDebitedAmount').not().isEmpty().isNumeric().escape().withMessage('POS debited amount error')
    ],
    Security.isLoggedIn,
    finRecController.SaveDepositTransaction);

    app.post('/transaction/withdrawal', 
    [
        check('transactionTerminal').not().isEmpty().escape().withMessage('Please choose a transaction terminal'),
        check('transactionType').not().isEmpty().escape().withMessage('Please choose a transaction type'),
        check('amountPaid').not().isEmpty().isNumeric().escape().withMessage('Please enter amount paid'),
        check('posDebitedAmount').not().isEmpty().isNumeric().escape().withMessage('POS debited amount error')
    ],
    Security.isLoggedIn,
    finRecController.SaveWithdrawalTransaction);

    app.post('/transaction/transfer', 
    [
        check('transactionTerminal').not().isEmpty().escape().withMessage('Please choose a transaction terminal'),
        check('transactionType').not().isEmpty().escape().withMessage('Please choose a transaction type'),
        check('amountReceived').not().isEmpty().isNumeric().escape().withMessage('Amount received error'),
        check('posDebitedAmount').not().isEmpty().isNumeric().escape().withMessage('POS debited amount error')
    ],
    Security.isLoggedIn, 
    finRecController.SaveTransferTransaction);

    app.post('/searchAll', Security.isLoggedIn, finRecController.searchAll);
}