const totalToPay = document.getElementById("price");
const cash = document.getElementById("cash");
const changeDueMessageBox = document.getElementById("change-due");
const purchaseButton = document.getElementById("purchase-btn");
let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
totalToPay.innerText = '$' + price;


// Main event
purchaseButton.addEventListener("click", () => {
  // The value per unit of each denomination
  const denomValues = [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 100];
  
  // Add the value of each denomination unit to each respective denomination array
  for (let i = 0; i < cid.length; i++) {
    cid[i].unshift(denomValues[i]);
  }
  
  // And reverse the parent array to go from higher to lower denominations
  const cidr = cid.reverse();
  
  // A pure function to add the numbers within an array of numbers
  const addNumbers = (array) => array.reduce((total, num) => total + num, 0).toFixed(2);
  
  // Get the sum total of all the money in the till
  const totalAmountInDrawer = () => {
    let amounts = [];
    for (let denomAmount of cidr) {
      amounts.push(denomAmount[2]);
    }
    return addNumbers(amounts);
  };
  
  // Get the total amount of change due
  const changeDue = (cashPaid, price) => {
    return (cashPaid - price).toFixed(2);
  };
  
  // Get how many units we have (??) of a denomination. A purish function that depends on a specific object structure.
  const howManyOfDenom = (array, index) => {
    return (array[index][2] / array[index][0]);
  }

  // Get how much remains in change after getting the required number of units of a denomination... Not used? remainingChange var?
  const remainderAfterDenom = (denomAmountValue, denomUnitValue, index) => {
    return (denomAmountValue % denomUnitValue[index][0]).toFixed(2);
  }
  
  const cashPaid = cash.value;
  const totalChangeDue = changeDue(cashPaid, price);
  // Set defaults
  let remainingChange = totalChangeDue; // Remaining change to find after a higher denom has been processed (starts at full change)
  let tally = []; // Total amounts of each denoimination required for change in an array THIS IS KEY!
  let denomMessage = []; // What we will return for a specific denomination
  let denomsSummary =[]; // What we will return for all denominations at the end
  let denomsSummaryString; // We turn it into a string for output to the user

  // Iterate through each denom and work out if we need and of it and if have enough of it 
  for (let i = 0; i < cidr.length; i++) {
    const qtyNeeded = Math.floor(remainingChange / cidr[i][0]); // How many do we want of this denom?

    // If we have enough of a denomination, and we could use some of it
    if (qtyNeeded !== 0  && qtyNeeded <= howManyOfDenom(cidr, i)) {
      tally[i] = (cidr[i][0] * qtyNeeded); // Set the tally for this denom (use what we need)
      denomMessage[i] = cidr[i][1] + ": $" + tally[i];
      remainingChange = (remainingChange - tally[i]).toFixed(2);
      denomsSummary.push(denomMessage[i]); // Add it to the summary 

    // If we don't have enough of a denomination, and we could use some of it
    } else if (qtyNeeded !== 0  && qtyNeeded > howManyOfDenom(cidr, i)) {
      tally[i] = (cidr[i][0] * (howManyOfDenom(cidr, i))); // Set the tally for this denom (use all of it)
      denomMessage[i] = cidr[i][1] + ": $" + tally[i];
      remainingChange = (remainingChange - tally[i]).toFixed(2); // we take all that we can and return the new amount of change still needed for next denoms
      if ( howManyOfDenom(cidr, i) !== 0) { // If there was some of this, we've used, so we add it to the summery, if there wasn't we don't add it
        denomsSummary.push(denomMessage[i]);
      }

    // If we have no use for the denomination
    } else {
      tally[i] = 0; // Set the tally for this denom to 0
    }
    denomsSummaryString = " " + denomsSummary.join(' ');
  }

  // Prepare the status message and put it in the message box
  const messageConstructor = () => {
    let status = "";
    // tallyUp 
    const tallyUp = addNumbers(tally);
    if (cashPaid < price) {
      alert("Customer does not have enough money to purchase the item");
      return;
    }
    if ((Number(totalAmountInDrawer()) < Number(totalChangeDue)) || tallyUp != Number(totalChangeDue)) {
      status = "Status: INSUFFICIENT_FUNDS";
    } else {
      if (cashPaid == price) {
        status = ("No change due - customer paid with exact cash"); 
      } else if (Number(totalAmountInDrawer()) == Number(totalChangeDue)) {
        status = "Status: CLOSED" + denomsSummaryString;
      } else if (Number(totalAmountInDrawer()) > Number(totalChangeDue)) { // and have enough of the denoms
        status = "Status: OPEN" + denomsSummaryString;
      }
    }
    changeDueMessageBox.innerText = status;
  };
  messageConstructor();
});
