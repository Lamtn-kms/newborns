import path from 'path';
import { FILE_PATHS } from '../constants/file-path';

/**
 * Generates a random string of 8 characters.
 *
 * This function creates a string consisting of 8 randomly selected
 * characters from the English alphabet (both uppercase and lowercase).
 */
function generateRandomString() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let value = '';
  for (let i = 0; i < 8; i++) {
    value += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return value;
}

/**
 * Generates a random string of 8 characters, including both letters (uppercase and lowercase) and numbers.
 *
 * This function creates a string consisting of 8 randomly selected characters from the English alphabet
 * (both uppercase and lowercase) and numeric digits (0-9).
 */
function generateRandomAlphanumericString() {
  const charactersAndNumbers = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let value = '';
  for (let i = 0; i < 8; i++) {
    value += charactersAndNumbers.charAt(Math.floor(Math.random() * charactersAndNumbers.length));
  }
  return value;
}

/**
 * Generates a random 16-digit number string.
 * e.g. "4823901756482391"
 */
export function generateRandomNumber(): string {
  const digits = '0123456789';
  let value = '';
  for (let i = 0; i < 16; i++) {
    value += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return value;
}

/**
 * Reads static user fields (country, city, month, year) from test-data.json
 * and generates random values for name and creditCard.
 */
export function generateUserFromData(): {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
} {
  const testData = require(path.resolve(__dirname, '..', FILE_PATHS.ASSETS.TEST_DATA)) as {
    users: {
      country: string;
      city: string;
      month: string;
      year: string;
    };
  };
  const { country, city, month, year } = testData.users;
  return {
    name: `User${generateRandomNumber()}`,
    country,
    city,
    creditCard: generateRandomNumber(),
    month,
    year,
  };
}
