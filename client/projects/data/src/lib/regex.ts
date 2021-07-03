// modified from source https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
// url regex to ensure that it must have http protocol and cannot start with www
export const URL_REGEX: RegExp = new RegExp(
  '^(http[s]?:\\/\\/(www\\.)?){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[0-9a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?',
  'i'
);

// regex that validates input for numbers, dashes, plus signs and round brackets (in the beginning); alphabetical strings will be rejected.
// e.g.,: +886-6969-42069 or (02)-6969-6969
export const PHONE_NUMBER_REGEX = '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$';

// This expression matches dates formatted as MM/DD/YYYY where months and days must be 2 digits each, zero padded.
// e.g.,: 01/01/2001 | 02/30/2001 | 12/31/2002
// note: not sure why it doesn't work if covered in string brackets
export const DATE_REGEX =
  /^(|(0[1-9])|(1[0-2]))\/((0[1-9])|(1\d)|(2\d)|(3[0-1]))\/((\d{4}))$/;

// Check if a string only contains numbers.
export const NUMBER_REGEX = /^\d*$/;

// Check if a string only contains non-negative numbers.
export const NON_NEGATIVE_NUMBER_REGEX = /^\d+$/;

// Check if a string has number greater than 0, and also cannot be negative
export const GREATER_THAN_ZERO_REGEX = /^[1-9]\d*$/;

// Check if a string only contain numbers, limited to 4 places
// eg., 2019
export const YEAR_REGEX = '^[1-2][0-9]{3}$';

export const SLUG_REGEX: RegExp = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const NOT_CHINESE_REGEX: RegExp = /^[^\u4E00-\u9FCC]+$/;

// source: http://regexlib.com/REDetails.aspx?regexp_id=23238
export const PASSWORD_REGEX: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])((?=.*\d)|(?=.*[!@#$%^&*()'"]))[A-Za-z\d!@#$%^&*()'"](?!\s).{7,}$/;
