// import { api_configs } from "@/api-services";
import axios from "axios";
// import * as XLSX from "xlsx";
// import CryptoJS from "crypto-js";

export const maxCapitalsLimit = 10000000000000;
export const bscRedirectUrl = "https://bscscan.com/";
const secret = process.env.REACT_APP_SECRET_KEY || "sdaf";


export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, function (match, p1) {
    return p1.toUpperCase();
  });
}
export const calculateTimeLeft = (endDate) => {
  if (endDate) {
    let difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  } else {
    return false;
  }
};
export const exportToCSV = (array, filename) => {
  if (array.length === 0) {
    console.error("Array is empty.");
    return;
  }

  // Extract headers from the keys of the first object
  const headers = Object.keys(array[0]);

  // Convert the array to CSV
  const csvRows = [];

  // Add the headers
  csvRows.push(headers.join(","));

  // Add the data rows
  for (const obj of array) {
    const values = headers.map((header) => {
      const value = obj[header] === undefined ? "" : obj[header];
      const escaped = ("" + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // Create a Blob from the CSV string
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "");
  const fullFilename = `${filename}_${timestamp}.csv`;
  // Create a link to download the Blob as a file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fullFilename;

  // Append the link to the body and trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function sortReferralLink(add) {
  const sortAdd = `${add?.slice(0, 25)}......${add?.slice(add?.length - 20)}`;
  return sortAdd;
}

export function sortReferral(add) {
  const sortAdd = `XXXXXX${add?.slice(add?.length - 4)}`;
  return sortAdd;
}

export const referredByUrl = (auth) =>
  `${window.location.origin}/auth/sign-up?${encrypt({
    referredBy: auth?.userData?.referralCode,
    referredByName: `${auth?.userData?.firstName} ${auth?.userData?.lastName}`,
  })}`;

export const encrypt = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secret);
    return encryptedData.toString();
  };

export const decrypt = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  
      return decryptedData ? JSON.parse(decryptedData) : null;
    } catch (error) {
      console.error("Decryption or JSON parsing failed:", error);
      return null; // Return null on failure
    }
  };
  


export const convertArrayToXLSX = async (data, fileName) => {
  try {
    const wb = XLSX.utils.book_new();
    const sheetData = [];
    // Flatten the data if it's an array of objects
    if (Array.isArray(data[0])) {
      data.forEach((array) => {
        const flattenedArray = array.map((obj) => flattenObject(obj, null, []));
        sheetData.push(...flattenedArray);
      });
    } else {
      sheetData.push(...data.map((obj) => flattenObject(obj, null, [])));
    }
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const downloadURL = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const timestampedFileName = `${fileName}_${timestamp}.xlsx`;
    await downloadFileAsync(downloadURL, timestampedFileName);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const toReadableFormat = (key) => {
  if (/^[A-Z]+$/.test(key)) {
    return key;
  }
  return key
    .replace(/([A-Z])/g, " $1") // Add a space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
};
const flattenObject = (obj, parent = "", res = {}) => {
  for (let key in obj) {
    let propName = parent ? parent + " " + key : key;
    if (Array.isArray(obj[key])) {
      obj[key].forEach((item, index) => {
        if (typeof item !== "string") {
          const itemKey = `${toReadableFormat(propName)} ${
            item?.action ? item?.action.toUpperCase() : index
          }`;
          Object.entries(item).forEach(([subKey, value]) => {
            const subPropName = `${toReadableFormat(subKey)}(${itemKey})`;
            res[subPropName] =
              typeof value === "boolean" ? value?.toString() : value;
          });
        } else {
          const itemKey = `${toReadableFormat(propName)} ${
            item?.action ? item?.action.toUpperCase() : index
          }`;
          res[itemKey] = item;
        }
      });
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      let readableKey = parent ? toReadableFormat(key) : toReadableFormat(key);
      res[readableKey] =
        typeof obj[key] === "boolean" ? obj[key]?.toString() : obj[key];
    }
  }
  return res;
};
async function downloadFileAsync(url, fileName) {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);

    return new Promise((resolve, reject) => {
      a.click();
      resolve();
    }).then(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
export function checkNumber(value) {
  // const re = /^(?!0+$)[0-9]{1,10}$/gm;
  // return re.test(value);
  const re = /^[1-9][0-9]{9}$/;
  return re.test(value);
}
export function verifyEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
export const getCoinImageDatahandler = async (token) => {
  try {
    const res = await axios({
      method: "GET",
      url: api_configs.get_wallet_coinImageData,
    });
    if (res.data.responseCode === 200) {
      return res?.data?.result;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
export function fixDecimal(num, toValues = 4) {
  let number = num;

  // Count zeros after the decimal point
  const zeroCount = countZerosAfterDecimal(number);
  // Handle cases where the number is a whole number or has no significant zeros
  if (zeroCount === 0 && number === Math.floor(number)) {
    return number.toFixed(zeroCount + 2); // Return as string if it's a whole number
  } else if (zeroCount === 0 || number >= 1) {
    // For numbers >= 1 or with no leading zeros, fix to 4 decimal places
    return Number(parseFloat(number).toFixed(toValues));
  } else if (number < 1) {
    // For numbers less than 1, fix the decimal precision based on the zero count
    return Number(
      parseFloat(number)
        .toFixed(zeroCount + 2)
        .toString()
    ); // Add extra precision to maintain accuracy
  }
}
/**
 * Given a number, it returns a string representing the number, with the proper
 * number of decimal places.  If the number is a whole number, it is returned as
 * a string with no decimal places.  Otherwise, it is returned with the minimum
 * number of decimal places required to represent the number.
 *
 * @param {number} num - The number to be formatted.
 * @returns {string} A string representing the number with the proper number of
 * decimal places.
 */

export function fixDecimalNonZero(num) {
  let number = num;

  // Count zeros after the decimal point
  const zeroCount = countZerosAfterDecimal(number);
  console.log(zeroCount, " ----- number ", number);
  // Handle cases where the number is a whole number or has no significant zeros
  if (zeroCount === 0 && number === Math.floor(number)) {
    return number.toFixed(zeroCount + 2); // Return as string if it's a whole number
  } else if (zeroCount === 0 || number >= 1) {
    // For numbers >= 1 or with no leading zeros, fix to 4 decimal places
    return Number(parseFloat(number).toFixed(4));
  } else if (number < 1) {
    // For numbers less than 1, fix the decimal precision based on the zero count
    return parseFloat(number)
      .toFixed(zeroCount + 2)
      .toString(); // Add extra precision to maintain accuracy
  }
}

function countZerosAfterDecimal(number) {
  // Convert number to string and split it at the decimal point
  const parts = number?.toString().split(".");

  if (parts?.length === 2) {
    const decimalPart = parts[1];
    const nonZeroIndex = decimalPart.search(/[^0]/);

    return nonZeroIndex === -1 ? decimalPart.length : nonZeroIndex;
  }

  // Return 0 if there's no decimal part
  return 0;
}

export const handleNegativeValue = (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
  }
  // const {
  //   key,
  //   target: { value, selectionStart },
  // } = event;
  // const newValue =
  //   value?.slice(0, selectionStart) + value?.slice(selectionStart + 1);
  // const parsedValue = parseFloat(newValue);
  // console.log(" ----- parsedValue ", parsedValue);
  // if (
  //   ["ArrowUp", "ArrowDown", "-"].includes(key) &&
  //   (key === "-" || isNaN(parsedValue) || parsedValue < 0)
  // ) {
  //   event.preventDefault();
  // }
};
export function funConEx(exchanges) {
  const filteredExchanges = [];
  for (const exchange of exchanges) {
    const matchingExchange = ExchangeArray.find(
      (exchangeOption) =>
        exchange.exchangeName.toLowerCase() ===
        exchangeOption.coinName.toLowerCase()
    );
    filteredExchanges.push({
      ...exchange,
      img: matchingExchange
        ? matchingExchange.img
        : exchange.exchangeName.toLowerCase(), // Fallback if no match is found
    });
  }
  return filteredExchanges;
}

export function sortAddress(add) {
  const sortAdd = `${add?.slice(0, 4)}...${add?.slice(add.length - 4)}`;
  return sortAdd;
}
export function sortAddressStart(add) {
  const sortAdd = `${add?.slice(0, 8)}${add.length > 8 ? "..." : ""}`;
  return sortAdd;
}
export function sortAddressWalletDeposite(add) {
  const sortAdd = `${add?.slice(0, 40)}...${add?.slice(add?.length - 4)}`;
  return sortAdd;
}
export function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string?.slice(1);
}
export function ReplaceDash(value, w) {
  return value.replace(/-/g, w);
}

export const setCryptoDecimals = (amt) => {
  amt = exponentialToDecimal(amt || 0);

  amt = amt?.replace(",", "");
  let arr = amt?.toString().split(".");

  if (arr.length > 1) {
    if (arr[1].length > 4) {
      return numberWithCommas(
        exponentialToDecimal(parseFloat(amt).toFixed(4)).toString()
      ).toString();
    } else {
      return numberWithCommas(parseFloat(amt).toFixed(4)).toString();
    }
  } else {
    if (amt) {
      return numberWithCommas(parseFloat(amt).toFixed(2)).toString();
    }
    return "0";
  }
};

const numberWithCommas = (x) => {
  let str = toFixedFunction(x, 8);

  let arr = str.split(".");

  let numbers = arr[0];
  let decimalNum = "";
  if (arr.length > 1) {
    decimalNum = arr[1];
    return `${numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalNum}`;
  } else {
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
export const toFixedFunction = (amt, decimals) => {
  let str = amt?.toString();
  if (str?.includes(".")) {
    str = str?.slice(0, str.indexOf(".") + (decimals + 1));
  }
  return str;
};
export const exponentialToDecimal = (exponential) => {
  let decimal = exponential?.toString()?.toLowerCase();
  if (decimal?.includes("e+")) {
    const exponentialSplitted = decimal?.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes(".")
          ? exponentialSplitted[0].split(".")[1].length
          : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text) => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text?.slice(0, textLength - j)},${text?.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
  }
  if (decimal?.toLowerCase().includes("e-")) {
    const exponentialSplitted = decimal?.split("e-");
    let prefix = "0.";
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += "0";
    }
    decimal = prefix + exponentialSplitted[0].replace(".", "");
  }
  return decimal;
};
//function to generate unique avatar of the registered user
export function generateUniqueAvatar(value) {
  return `https://avatars.dicebear.com/api/identicon/${value}.svg`;
}
export function isValidFacebookUrl(value) {
  const re = /^(https?:\/\/)?(www\.)?facebook\.com(?:\/[a-zA-Z0-9_\-\.]+)?$/;
  return re.test(value);
}
export function isValidTwitterUrl(value) {
  const re = /^(https?:\/\/)?(www\.)?twitter\.com(?:\/[a-zA-Z0-9_]+)?$/;
  return re.test(value);
}
export function isValidInstagramUrl(value) {
  const re = /^(https?:\/\/)?(www\.)?instagram\.com(?:\/[a-zA-Z0-9_]+)?$/;
  return re.test(value);
}
export function isValidDiscordUrl(value) {
  const re = /^(https?:\/\/)?(www\.)?discord\.gg(?:\/[a-zA-Z0-9_]+)?$/;
  return re.test(value);
}
export const currencyFormatter = (value) => {
  let formatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(value);
};
export const ExchangeArray = [
  { img: "/images/ExchangeLogo/kraken.png", coinName: "Kraken" },
  { img: "/images/ExchangeLogo/binance.jpg", coinName: "Binance" },
  { img: "/images/ExchangeLogo/Mexc.png", coinName: "Mexc" },
  { img: "/images/ExchangeLogo/Bitmart.jpg", coinName: "Bitmart" },
  { img: "/images/ExchangeLogo/gemini.png", coinName: "Gemini" },
  { img: "/images/ExchangeLogo/coinbasepro.png", coinName: "Coinbasepro" },
  { img: "/images/ExchangeLogo/bitstamp.png", coinName: "bitstamp" },
  { img: "/images/ExchangeLogo/coinbase.png", coinName: "coinbase" },
  { img: "/images/ExchangeLogo/gateio.png", coinName: "gateio" },
];
export const ExchangeLogo = [
  {
    img: "/images/ExchangeLogo/gateio.png",
    title: "gateio",
  },
  {
    img: "/images/ExchangeLogo/coinbase.png",
    title: "coinbase",
  },
  {
    img: "/images/binace.svg",
    title: "binance",
  },
  {
    img: "/images/ExchangeLogo/bitstamp.png",
    title: "bitstamp",
  },
  {
    img: "/images/ExchangeLogo/Mexc.png",
    title: "Mexc",
  },
  {
    img: "/images/ExchangeLogo/Bitmart.jpg",
    title: "Bitmart",
  },
  {
    img: "/images/ExchangeLogo/cryptocom.png",
    title: "cryptocom",
  },
  {
    img: "/images/ExchangeLogo/ftxus.png",
    title: "ftxus",
  },
  {
    img: "/images/ExchangeLogo/gemini.png",
    title: "gemini",
  },
  {
    img: "/images/ExchangeLogo/cexio.png",
    title: "cexio",
  },
  {
    img: "/images/ExchangeLogo/huobi.png",
    title: "huobi",
  },
  {
    img: "/images/ExchangeLogo/kraken.png",
    title: "kraken",
  },
  {
    img: "/images/ExchangeLogo/kucoin.png",
    title: "kucoin",
  },
];
export function countDecimalPlaces(number) {
  const decimalString = number.toString().split(".")[1];
  return decimalString ? decimalString.length : 0;
}
export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const validateAccountAddress = (account) =>
  /^0x[a-fA-F0-9]{40}$/.test(account);

export const formatNumberInteger = (num, lenVal) =>
  Number.isInteger(num)
    ? num.toLocaleString()
    : +parseFloat(num).toFixed(lenVal).toLocaleString();
