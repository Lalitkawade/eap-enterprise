// Utility to convert numbers into Indian Rupees in Words (Lakhs & Crores format)
export function numberToWordsIndian(num) {
  if (num === null || num === undefined || isNaN(num)) return "Zero Rupees Only";

  const numFloat = parseFloat(num);
  if (numFloat === 0) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertLessThanOneThousand(n) {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  }

  const parts = numFloat.toFixed(2).split(".");
  let rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  let words = "";

  // Crores (>= 1,00,00,000)
  if (rupees >= 10000000) {
    const crores = Math.floor(rupees / 10000000);
    words += convertLessThanOneThousand(crores) + " Crore ";
    rupees %= 10000000;
  }

  // Lakhs (>= 1,00,000)
  if (rupees >= 100000) {
    const lakhs = Math.floor(rupees / 100000);
    words += convertLessThanOneThousand(lakhs) + " Lakh ";
    rupees %= 100000;
  }

  // Thousands (>= 1,000)
  if (rupees >= 1000) {
    const thousands = Math.floor(rupees / 1000);
    words += convertLessThanOneThousand(thousands) + " Thousand ";
    rupees %= 1000;
  }

  // Hundreds and remainder
  if (rupees > 0) {
    words += convertLessThanOneThousand(rupees) + " ";
  }

  words = words.trim();
  if (!words) words = "Zero";

  let result = words + " Rupees";
  if (paise > 0) {
    result += " and " + convertLessThanOneThousand(paise) + " Paise";
  }

  return result + " Only";
}
