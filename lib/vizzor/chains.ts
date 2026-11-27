/**
 * The blockchains Vizzor reads with live data.
 *
 * Mirrors the product's chain registry (explorer-only chains left out). The
 * count shown on the site is this list's length, so it cannot drift from the
 * marks on screen.
 */
export const CHAINS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'solana', name: 'Solana' },
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'base', name: 'Base' },
  { id: 'arbitrum', name: 'Arbitrum' },
  { id: 'optimism', name: 'Optimism' },
  { id: 'polygon', name: 'Polygon' },
  { id: 'bnb', name: 'BNB Chain' },
  { id: 'avalanche', name: 'Avalanche' },
  { id: 'tron', name: 'Tron' },
  { id: 'ton', name: 'TON' },
  { id: 'sui', name: 'Sui' },
  { id: 'aptos', name: 'Aptos' },
  { id: 'xrp', name: 'XRP Ledger' },
  { id: 'linea', name: 'Linea' },
  { id: 'zksync', name: 'zkSync' },
  { id: 'scroll', name: 'Scroll' },
  { id: 'blast', name: 'Blast' },
  { id: 'mantle', name: 'Mantle' },
  { id: 'sonic', name: 'Sonic' },
  { id: 'hyperevm', name: 'HyperEVM' },
  { id: 'gnosis', name: 'Gnosis' },
  { id: 'celo', name: 'Celo' },
  { id: 'thorchain', name: 'THORChain' },
  { id: 'litecoin', name: 'Litecoin' },
  { id: 'stellar', name: 'Stellar' },
  { id: 'cardano', name: 'Cardano' },
  { id: 'near', name: 'NEAR' },
  { id: 'algorand', name: 'Algorand' },
  { id: 'hedera', name: 'Hedera' },
  { id: 'starknet', name: 'Starknet' },
] as const;

export type ChainId = (typeof CHAINS)[number]['id'];

export const CHAIN_COUNT = CHAINS.length;

/** A few well-known chains for compact rows; the rest show as +N. */
export const MAJOR_CHAINS: readonly ChainId[] = ['bitcoin', 'ethereum', 'solana', 'bnb', 'xrp'];
export const INTEL_SAMPLE: readonly ChainId[] = ['ethereum', 'solana', 'bitcoin', 'base', 'arbitrum', 'tron'];

export function chainName(id: ChainId): string {
  return CHAINS.find((c) => c.id === id)?.name ?? id;
}
