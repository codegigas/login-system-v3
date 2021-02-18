/*!
 * cg-validator
 * Copyright(c) 2021 Knightwalker
 * MIT Licensed
 */

"use strict";

const isEmailValid = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/gm;

  if (regex.test(email)) { 
    return true; 
  } 
  else { 
    return false; 
  }
}

module.exports = {
  isEmailValid: isEmailValid
}