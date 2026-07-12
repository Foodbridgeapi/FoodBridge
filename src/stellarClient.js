import { Horizon, TransactionBuilder, Networks, Operation, Keypair, Asset } from '@stellar/stellar-sdk';

// Stellar configuration for FoodBridge
const STELLAR_NETWORK = import.meta.env.VITE_STELLAR_NETWORK === 'testnet' ? Networks.TESTNET : Networks.PUBLIC;
const HORIZON_URL = import.meta.env.VITE_STELLAR_NETWORK === 'testnet'
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.org';

// Initialize Stellar server
const server = new Horizon.Server(HORIZON_URL);

// FoodBridge issuer account (for creating custom assets)
const FOODBRIDGE_ISSUER_PUBLIC_KEY = import.meta.env.VITE_FOODBRIDGE_ISSUER_PUBLIC_KEY;

/**
 * Create a Stellar wallet for a new user
 * @returns {Object} - Keypair with public and secret keys
 */
export function createStellarWallet() {
  const pair = Keypair.random();
  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret(),
  };
}

/**
 * Fund a testnet account with XLM
 * @param {string} publicKey - Stellar public key
 */
export async function fundTestnetAccount(publicKey) {
  if (import.meta.env.VITE_STELLAR_NETWORK !== 'testnet') {
    throw new Error('Testnet funding only available on testnet');
  }
  
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error funding testnet account:', error);
    throw error;
  }
}

/**
 * Get account balance
 * @param {string} publicKey - Stellar public key
 * @returns {Object} - Account balances
 */
export async function getAccountBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const balances = account.balances.map(balance => ({
      asset: balance.asset_code || 'XLM',
      balance: balance.balance,
    }));
    return balances;
  } catch (error) {
    console.error('Error getting account balance:', error);
    throw error;
  }
}

/**
 * Create a custom FoodBridge token asset
 * @param {string} assetCode - Asset code (e.g., 'FOOD', 'RESCUE')
 * @returns {Asset} - Stellar Asset object
 */
export function createFoodBridgeAsset(assetCode = 'FOOD') {
  return new Asset(assetCode, FOODBRIDGE_ISSUER_PUBLIC_KEY);
}

/**
 * Send payment transaction
 * @param {string} secretKey - Sender's secret key
 * @param {string} destinationPublicKey - Recipient's public key
 * @param {string} amount - Amount to send
 * @param {Asset} asset - Asset to send (default: XLM)
 */
export async function sendPayment(secretKey, destinationPublicKey, amount, asset = Asset.native()) {
  try {
    const sourceKeypair = Keypair.fromSecret(secretKey);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: STELLAR_NETWORK,
    })
      .addOperation(Operation.payment({
        destination: destinationPublicKey,
        asset: asset,
        amount: amount,
      }))
      .setTimeout(30)
      .build();
    
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Error sending payment:', error);
    throw error;
  }
}

/**
 * Create a trust line for custom asset
 * @param {string} secretKey - User's secret key
 * @param {Asset} asset - Asset to trust
 * @param {string} limit - Trust limit (default: maximum)
 */
export async function createTrustLine(secretKey, asset, limit = '922337203685.4775807') {
  try {
    const sourceKeypair = Keypair.fromSecret(secretKey);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: STELLAR_NETWORK,
    })
      .addOperation(Operation.changeTrust({
        asset: asset,
        limit: limit,
      }))
      .setTimeout(30)
      .build();
    
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Error creating trust line:', error);
    throw error;
  }
}

/**
 * Track food donation on Stellar blockchain
 * @param {string} donorSecretKey - Donor's secret key
 * @param {string} foodId - Unique food item ID
 * @param {string} metadata - Food metadata (JSON string)
 */
export async function recordFoodDonation(donorSecretKey, foodId, metadata) {
  try {
    const sourceKeypair = Keypair.fromSecret(donorSecretKey);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    
    const memo = {
      type: 'hash',
      value: Buffer.from(JSON.stringify({ foodId, metadata })).toString('base64'),
    };
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: STELLAR_NETWORK,
      memo: memo,
    })
      .addOperation(Operation.payment({
        destination: FOODBRIDGE_ISSUER_PUBLIC_KEY,
        asset: Asset.native(),
        amount: '0.00001', // Minimum payment for record-keeping
      }))
      .setTimeout(30)
      .build();
    
    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Error recording food donation:', error);
    throw error;
  }
}

/**
 * Get transaction history for food tracking
 * @param {string} publicKey - Account public key
 * @returns {Array} - Transaction history
 */
export async function getTransactionHistory(publicKey) {
  try {
    const transactions = await server.transactions()
      .forAccount(publicKey)
      .order('desc')
      .limit(10)
      .call();
    
    return transactions.records;
  } catch (error) {
    console.error('Error getting transaction history:', error);
    throw error;
  }
}

export default {
  createStellarWallet,
  fundTestnetAccount,
  getAccountBalance,
  createFoodBridgeAsset,
  sendPayment,
  createTrustLine,
  recordFoodDonation,
  getTransactionHistory,
};
