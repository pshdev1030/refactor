const plays = require("./plays.json");
const invoices = require("./invoices.json");

const toUSD = (number) =>
  new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(number);

const amountForTragedy = (performance) => {
  let amount = 40000;
  if (performance.audience > 30) {
    amount += 1000 * (performance.audience - 30);
  }
  return amount;
};

const amountForComedy = (performance) => {
  let amount = 30000;
  if (performance.audience > 20) {
    amount += 10000 + 500 * (performance.audience - 20);
  }
  return amount;
};

const amountMap = {
  tragedy: amountForTragedy,
  comedy: amountForComedy,
};

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    const play = plays[perf.playId];
    const thisAmount = amountMap?.[play.type](perf);
    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
    result += `${play.name}: ${toUSD(thisAmount / 100)} (${perf.audience}})`;

    // 청구 내역을 출력한다
    result += `${play.name}: ${toUSD(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${toUSD(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

console.log(statement(invoices[0], plays));
