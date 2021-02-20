"use strict";

/**
 * Keep things simple
 * @param {String} str
 * @param {Object} options
 * @param {Boolean} options.ignore_whitespace - `false` by default
 */
const isStringEmpty = (str, options) => {
  var opts = options || {};
  var ignore_whitespace = opts.ignore_whitespace || false;

  if (ignore_whitespace === false) {
    if (str.trim().length === 0) {
      return true;
    }
  } else {
    if (str.length === 0) {
      return true;
    }
  }

  return false;
}

/**
 * Keep things simple
 * @param {String} str1 
 * @param {String} str2 
 */
const areStringsEqual = (str1, str2) => {
  if (str1 === str2) {
    return true;
  }
  return false;
}

/**
 * Validates and email address.
 * @param {String} email 
 */
const isEmailValid = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/gm;

  if (regex.test(email)) { 
    return true; 
  } 
  return false; 
}

module.exports = {
  isStringEmpty: isStringEmpty,
  areStringsEqual: areStringsEqual,
  isEmailValid: isEmailValid
}