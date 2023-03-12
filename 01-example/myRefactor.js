const plays = require("./plays.json");
const invoices = require("./invoices.json");

const toUSD = (number) =>
  new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(number);

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    const play = plays[perf.playId];
    let thisAmount = 0;
    switch (play.type) {
      case "tragedy":
        thisAmount = 4000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy": {
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      }
      default: {
        throw new Error(`알 수 없는 장르 : ${play.type}`);
      }
    }
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
