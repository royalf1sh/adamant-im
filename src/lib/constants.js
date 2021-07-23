export const EPOCH = Date.UTC(2017, 8, 2, 17, 0, 0, 0)

export const Transactions = {
  SEND: 0,
  SIGNATURE: 1,
  DELEGATE: 2,
  VOTE: 3,
  MULTI: 4,
  DAPP: 5,
  IN_TRANSFER: 6,
  OUT_TRANSFER: 7,
  CHAT_MESSAGE: 8,
  STATE: 9
}

export const Cryptos = {
  ADM: 'ADM',
  BTC: 'BTC',
  ETH: 'ETH',
  LSK: 'LSK',
  DOGE: 'DOGE',
  DASH: 'DASH',
  USDS: 'USDS',
  RES: 'RES',
  BZ: 'BZ',
  KCS: 'KCS',
  BNB: 'BNB'
}

export const CryptosNames = {
  [Cryptos.ADM]: 'ADAMANT',
  [Cryptos.BNB]: 'Binance Coin',
  [Cryptos.ETH]: 'Ethereum',
  [Cryptos.LSK]: 'Lisk',
  [Cryptos.BZ]: 'Bit-Z Token',
  [Cryptos.RES]: 'Resfinex Token',
  [Cryptos.DOGE]: 'DOGE',
  [Cryptos.DASH]: 'DASH',
  [Cryptos.KCS]: 'KuCoin Shares',
  [Cryptos.USDS]: 'Stably Dollar',
  [Cryptos.BTC]: 'Bitcoin'
}

export const ERC20 = Object.freeze([
  Cryptos.BNB,
  Cryptos.BZ,
  Cryptos.KCS,
  Cryptos.USDS,
  Cryptos.RES
])

export const BTC_BASED = Object.freeze([
  Cryptos.DOGE,
  Cryptos.DASH,
  Cryptos.BTC
])

export const LSK_BASED = Object.freeze([
  Cryptos.LSK
])

export const isErc20 = crypto => ERC20.includes(crypto)

export const isEthBased = crypto => isErc20(crypto) || crypto === Cryptos.ETH

export const isFeeEstimate = crypto => isEthBased(crypto)

export const isBtcBased = crypto => BTC_BASED.includes(crypto)

export const isLskBased = crypto => LSK_BASED.includes(crypto)

export const isSelfTxAllowed = crypto => LSK_BASED.includes(crypto) || crypto === Cryptos.ADM

/** Number of decimal places for the different crypto amounts */
export const CryptoAmountPrecision = {
  ADM: 8,
  ETH: 6,
  BNB: 6,
  DOGE: 8,
  BZ: 6,
  RES: 5,
  DASH: 5,
  KCS: 6,
  USDS: 6,
  BTC: 8,
  LSK: 8
}

export const CryptoNaturalUnits = {
  ADM: 8,
  ETH: 18,
  BNB: 18,
  DOGE: 8,
  BZ: 18,
  DASH: 8,
  RES: 5,
  KCS: 6,
  USDS: 6,
  BTC: 8,
  LSK: 8
}

/** Fees for the misc ADM operations */
export const Fees = {
  /** Storing a value into the KVS */
  KVS: 0.001,
  /** Transferring tokens */
  ADM_TRANSFER: 0.5,
  NOT_ADM_TRANSFER: 0.001
}

/** Regex for detecting of base64 encoded string */
export const base64regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/

export const RE_ADM_ADDRESS = /^U([0-9]{6,})$/i
export const RE_BTC_ADDRESS = /^(bc1|[13])[a-km-zA-HJ-NP-Z02-9]{25,39}$/
export const RE_DASH_ADDRESS = /^[7X][1-9A-HJ-NP-Za-km-z]{33,}$/
export const RE_DOGE_ADDRESS = /^[A|D|9][A-Z0-9]([0-9a-zA-Z]{9,})$/
export const RE_LSK_ADDRESS = /^[0-9]{2,21}L$/

export const Symbols = {
  CLOCK: String.fromCharCode(0x23f0), // ⏰
  HOURGLASS: String.fromCharCode(0x23f3), // ⏳
  CROSS: String.fromCharCode(0x274c) // ❌
}

export const Delegates = {
  ACTIVE_DELEGATES: 101
}

export const WelcomeMessage = {
  ADAMANT_BOUNTY: 'ADAMANT Bounty',
  ADAMANT_ICO: 'ADAMANT Tokens'
}

/**
 * These gas limit values are used only for estimate fees for ETH & ERC-20 transfers in the Send tokens form,
 * Actual gas limit values are calculated with estimateGas(transactionObject)
 * when each specific transaction is created
 */

/** Gas limit value for the ETH transfers */
export const ETH_TRANSFER_GAS = 24000
/** Gas limit value for the ERC-20 transfers */
export const ERC20_TRANSFER_GAS = ETH_TRANSFER_GAS * 2.4

/** Increase fee multiplier. Used as a checkbox on SendFundsForm */
export const INCREASE_FEE_MULTIPLIER = 2

export default {
  EPOCH,
  Transactions
}

export const UserPasswordArticleLink = 'https://medium.com/adamant-im/more-convenience-login-to-the-web-messenger-with-user-password-9d48a736dfd8'

export const UserPasswordHashSettings = {
  SALT: 'salt',
  ITERATIONS: 100000,
  KEYLEN: 64,
  DIGEST: 'sha512'
}

export const TransactionStatus = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  DELIVERED: 'delivered',
  REGISTERED: 'registered', // ~DELIVERED
  REJECTED: 'rejected',
  ERROR: 'error', // ~REJECTED
  INVALID: 'invalid',
  UNKNOWN: 'unknown' // We don't recognize a cryptocurrency
}

export const tsIcon = function (status) {
  status = status.toLowerCase()
  if (status === TransactionStatus.CONFIRMED) {
    return 'mdi-check'
  } else if (status === TransactionStatus.PENDING || status === TransactionStatus.DELIVERED || status === TransactionStatus.REGISTERED) {
    return 'mdi-clock-outline'
  } else if (status === TransactionStatus.REJECTED || status === TransactionStatus.ERROR) {
    return 'mdi-close-circle-outline'
  } else if (status === TransactionStatus.INVALID) {
    return 'mdi-alert-outline'
  } else if (status === TransactionStatus.UNKNOWN) {
    return 'mdi-help-circle-outline'
  }
}

export const tsColor = function (status) {
  status = status.toLowerCase()
  if (status === TransactionStatus.REJECTED || status === TransactionStatus.ERROR) {
    return 'red'
  } else if (status === TransactionStatus.INVALID || status === TransactionStatus.UNKNOWN) {
    return 'yellow'
  }
  return ''
}

export const tsUpdatable = function (status, currency) {
  currency = currency.toUpperCase()
  status = status.toLowerCase()
  if (currency === Cryptos.ADM) {
    return false
  } else if (status === TransactionStatus.CONFIRMED) {
    return true
  } else if (status === TransactionStatus.PENDING || status === TransactionStatus.DELIVERED || status === TransactionStatus.REGISTERED) {
    return false
  } else if (status === TransactionStatus.REJECTED || status === TransactionStatus.ERROR) {
    return true
  } else if (status === TransactionStatus.INVALID) {
    return true
  } else if (status === TransactionStatus.UNKNOWN) {
    return false
  }
}

/**
 * Minimal transferrable amounts for the known cryptos
 */
export const MinAmounts = Object.freeze({
  BTC: 546e-8 // 546 satoshis
})

/**
 * Returns minimal amount that can be transferred for the specified crypto
 * @param {string} crypto crypto
 * @returns {number}
 */
export function getMinAmount (crypto) {
  let amount = MinAmounts[crypto]

  if (!amount) {
    const precision = CryptoAmountPrecision[crypto]
    amount = precision ? Math.pow(10, -precision) : 0
  }

  return amount
}
