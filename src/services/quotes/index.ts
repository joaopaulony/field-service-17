
// Re-export all quote service functions from a single entry point
import { 
  getQuotes, 
  getQuote,
  createQuote, 
  updateQuote, 
  deleteQuote 
} from './quoteCore';

import {
  addQuoteItem,
  updateQuoteItem,
  deleteQuoteItem,
  updateQuoteTotalAmount
} from './quoteItems';

import {
  getQuoteSummary
} from './quoteSummary';

import {
  generateQuotePDF,
  downloadQuotePDF,
  sendQuoteByEmail
} from './quoteExport';

export {
  // Core quote operations
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  
  // Quote item operations
  addQuoteItem,
  updateQuoteItem,
  deleteQuoteItem,
  updateQuoteTotalAmount,
  
  // Summary operations
  getQuoteSummary,
  
  // Export and sharing operations
  generateQuotePDF,
  downloadQuotePDF,
  sendQuoteByEmail
};
