/**
 * The code to fetch the payments data has already been written
 * for you below. To complete this group project, your group
 * will need to write code to make this app do the following:
 *
 * 1. Show the current balance based on the initial balance and
 *    any completed payments. Each completed payment will add to
 *    the balance.
 * 2. Add the payments to the table. Each payment should show
 *    the date of the payment, its status (whether is pending or
 *    complete), the description, the amount, and the balance
 *    after that payment was completed.
 *
 *    Pending payments should appear with a pink background.
 *    This can be applied by adding the `pending` class to the
 *    table row (`<tr>`) for each pending payment.
 * 3. Show what the balance will be after pending payments are
 *    completed.
 * 4. Show the total income of all payments that were received
 *    this month (May, 2019), including pending payments.
 * 5. Show the amount of the most valuable payment that was
 *    received this month (May 2019).
 * 6. For each PENDING payment, add a button that says "cancel"
 *    to the end of that payment's row. When the button is
 *    clicked, the payment should be removed from the account
 *    and the render function should be called again to update
 *    the page.
 */

/**
 * This is the account details that you will use with this
 * exercise.
 *
 * Do not edit this code.
 */
var account = {
  number: 100402153,
  initialBalance: 100,
  paymentsUrl: "/data/payments.json",
  payments: []
};

/**
 * The code below has been written for you. When the "Load"
 * button is clicked, it will get the payments details, assign
 * them to the account variable, and call the render function
 * to update details in the DOM.
 *
 * You may edit this code.
 */
document.querySelector("#loadButton").addEventListener("click", function() {
  fetch(account.paymentsUrl)
    .then(response => response.json())
    .then(payments => {
      account.payments = payments;
      render(account);
    });
});

/**
 * Write a render function below that updates the DOM with the
 * account details.
 *
 * EVERY update to the DOM should be contained in this
 * function so that you can call it over and over again
 * whenever there is an update to the account details.
 *
 * We have completed one of the DOM updates already by
 * entering the account number on the page.
 *
 * @param {Object} account The account details
 */
function render(account) {
  // Display the account number
  document.querySelector("#accountNumber").innerText = account.number;
  document.querySelector("#balanceAmount").innerText =
    account.initialBalance + calculateTotalBalance(account.payments);
  var paymentsTable = document.querySelector("#paymentsList");
  account.payments.forEach(payment => {
    paymentsTable.appendChild(createPaymentRow(payment));
  });
  document.querySelector("#pendingBalance").innerText =
    account.initialBalance + calculateWithPendingBalance(account.payments);

  var mostValuable = document.querySelector("#mostValuablePayment");
  var paymentsInMay = account.payments.filter(isInMay);
  var amount = Math.max.apply(
    Math,
    paymentsInMay.map(function(payment) {
      return payment.amount;
    })
  );
  mostValuable.innerText = amount;
}

function createPaymentRow(payment) {
  var row = document.createElement("tr");

  var paymentDateElt = document.createElement("td");
  paymentDateElt.innerText = payment.date;
  row.appendChild(paymentDateElt);

  var paymentStatusElt = document.createElement("td");
  var status = "Completed";
  if (!payment.completed) {
    status = "Pending";
    row.classList.add("pending");
  }
  paymentStatusElt.innerText = status;
  row.appendChild(paymentStatusElt);

  var paymentDescElt = document.createElement("td");
  paymentDescElt.innerText = payment.description;
  row.appendChild(paymentDescElt);

  var paymentAmountElt = document.createElement("td");
  paymentAmountElt.innerText = payment.amount;
  row.appendChild(paymentAmountElt);

  var paymentActionElt = document.createElement("td");
  if (status === "Pending") {
    var button = document.createElement("button");
    button.innerText = "cancel";
    paymentActionElt.appendChild(button);
    button.addEventListener("click", removePending);
  } else {
    paymentActionElt.innerText = "";
  }

  row.appendChild(paymentActionElt);

  return row;
}

function calculateTotalBalance(payments) {
  var completedPayments = payments.filter(p => p.completed);

  return completedPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
}

function calculateWithPendingBalance(payments) {
  return payments.reduce((total, payment) => total + payment.amount, 0);
}
function isInMay(payment) {
  var date = new Date(payment.date);
  return date.getMonth() === 4 && payment.completed === true;
}

function removePending() {
  var amount = document.querySelector("#balanceAmount").innerText;
  for (i = 0; i < account.payments.length; i++) {
    if (account.payments[i].completed === false) {
      var pendingPayment = account.payments[i].amount;
      document.querySelector("#balanceAmount").innerText = (
        amount - pendingPayment
      ).toFixed(2);
    }
  }
}
