/**
 * Wallet and token marks from the web3icons set, in their own colours on a
 * round disc, like the chain marks.
 */
import type { ComponentType } from 'react';
import TokenAVAX from '@web3icons/react/icons/tokens/TokenAVAX';
import TokenBNB from '@web3icons/react/icons/tokens/TokenBNB';
import TokenBTC from '@web3icons/react/icons/tokens/TokenBTC';
import TokenDOGE from '@web3icons/react/icons/tokens/TokenDOGE';
import TokenETH from '@web3icons/react/icons/tokens/TokenETH';
import TokenLINK from '@web3icons/react/icons/tokens/TokenLINK';
import TokenSOL from '@web3icons/react/icons/tokens/TokenSOL';
import TokenXRP from '@web3icons/react/icons/tokens/TokenXRP';
import WalletBackpack from '@web3icons/react/icons/wallets/WalletBackpack';
import WalletMetamask from '@web3icons/react/icons/wallets/WalletMetamask';
import WalletPhantom from '@web3icons/react/icons/wallets/WalletPhantom';
import WalletRabby from '@web3icons/react/icons/wallets/WalletRabby';
import WalletSolflare from '@web3icons/react/icons/wallets/WalletSolflare';

type Icon = ComponentType<{ variant?: 'branded' | 'mono' | 'background'; size?: number | string }>;

/** The wallets Vizzor signs people in with. */
export const WALLETS = [
  { id: 'phantom', name: 'Phantom', Icon: WalletPhantom as Icon },
  { id: 'solflare', name: 'Solflare', Icon: WalletSolflare as Icon },
  { id: 'backpack', name: 'Backpack', Icon: WalletBackpack as Icon },
  { id: 'metamask', name: 'MetaMask', Icon: WalletMetamask as Icon },
  { id: 'rabby', name: 'Rabby', Icon: WalletRabby as Icon },
] as const;

export function Disc({ Icon, size = 28 }: { Icon: Icon; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid shrink-0 place-items-center overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <Icon variant="background" size={size} />
    </span>
  );
}

/** Token marks by ticker, for the example call tape. */
export const TOKENS = {
  BTC: TokenBTC as Icon,
  ETH: TokenETH as Icon,
  SOL: TokenSOL as Icon,
  BNB: TokenBNB as Icon,
  XRP: TokenXRP as Icon,
  AVAX: TokenAVAX as Icon,
  DOGE: TokenDOGE as Icon,
  LINK: TokenLINK as Icon,
} as const;

export type Ticker = keyof typeof TOKENS;
