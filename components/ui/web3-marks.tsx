/**
 * Wallet and token marks from the web3icons set, each on a round disc so a
 * row of them reads evenly on a light or a dark ground.
 */
import type { ComponentType } from 'react';
import TokenSOL from '@web3icons/react/icons/tokens/TokenSOL';
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
    <span aria-hidden className="inline-grid shrink-0 place-items-center overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Icon variant="background" size={size} />
    </span>
  );
}

export function SolanaMark({ size = 24 }: { size?: number }) {
  return <Disc Icon={TokenSOL as Icon} size={size} />;
}
