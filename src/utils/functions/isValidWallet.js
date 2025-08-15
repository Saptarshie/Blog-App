/**
 * Validates cryptocurrency wallet addresses
 * @param {string} address - The wallet address to validate
 * @param {string} [type='any'] - The type of cryptocurrency (eth, btc, any)
 * @return {boolean} Whether the address is valid
 */
export function isValidWalletAddress(address, type = 'any') {
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Ethereum address validation
  function isValidEthereumAddress(addr) {
    // Check basic format - 0x followed by 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  }

  // Bitcoin address validation (basic validation)
  function isValidBitcoinAddress(addr) {
    // Legacy addresses start with 1 or 3
    const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    // Segwit addresses start with bc1
    const segwitRegex = /^bc1[ac-hj-np-z02-9]{39,59}$/;
    return legacyRegex.test(addr) || segwitRegex.test(addr);
  }

  // Binance Smart Chain follows Ethereum format
  function isValidBSCAddress(addr) {
    return isValidEthereumAddress(addr);
  }

  // Polygon follows Ethereum format
  function isValidPolygonAddress(addr) {
    return isValidEthereumAddress(addr);
  }

  // Solana addresses are base58-encoded strings, 32-44 characters long
  function isValidSolanaAddress(addr) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
  }

  switch (type.toLowerCase()) {
    case 'eth':
    case 'ethereum':
      return isValidEthereumAddress(address);
    case 'btc':
    case 'bitcoin':
      return isValidBitcoinAddress(address);
    case 'bsc':
    case 'binance':
      return isValidBSCAddress(address);
    case 'matic':
    case 'polygon':
      return isValidPolygonAddress(address);
    case 'sol':
    case 'solana':
      return isValidSolanaAddress(address);
    case 'any':
    default:
      // Check against all supported blockchains
      return (
        isValidEthereumAddress(address) ||
        isValidBitcoinAddress(address) ||
        isValidSolanaAddress(address)
      );
  }
}

// // Example usage with your data variable
// if (isValidWalletAddress(data)) {
//   // Proceed with saving the wallet address
//   const user = await User.findByIdAndUpdate(
//     decoded.id,
//     { $set: { subscriberCount: 0, walletAddress: data } },
//     { new: true }
//   );
// } else {
//   throw new Error('Invalid wallet address format');
// }
