/**
 * ChainMark — a blockchain's own mark on a round disc.
 *
 * Uses the `background` variant: a full tile in the brand's colour with the
 * glyph knocked out, clipped to a circle. It is the one variant that reads on
 * both a light and a dark ground.
 */
import type { ComponentType } from 'react';
import NetworkAlgorand from '@web3icons/react/icons/networks/NetworkAlgorand';
import NetworkAptos from '@web3icons/react/icons/networks/NetworkAptos';
import NetworkArbitrumOne from '@web3icons/react/icons/networks/NetworkArbitrumOne';
import NetworkAvalanche from '@web3icons/react/icons/networks/NetworkAvalanche';
import NetworkBase from '@web3icons/react/icons/networks/NetworkBase';
import NetworkBinanceSmartChain from '@web3icons/react/icons/networks/NetworkBinanceSmartChain';
import NetworkBitcoin from '@web3icons/react/icons/networks/NetworkBitcoin';
import NetworkBlast from '@web3icons/react/icons/networks/NetworkBlast';
import NetworkCardano from '@web3icons/react/icons/networks/NetworkCardano';
import NetworkCelo from '@web3icons/react/icons/networks/NetworkCelo';
import NetworkEthereum from '@web3icons/react/icons/networks/NetworkEthereum';
import NetworkGnosis from '@web3icons/react/icons/networks/NetworkGnosis';
import NetworkHederaHashgraph from '@web3icons/react/icons/networks/NetworkHederaHashgraph';
import NetworkHyperEvm from '@web3icons/react/icons/networks/NetworkHyperEvm';
import NetworkLinea from '@web3icons/react/icons/networks/NetworkLinea';
import NetworkLitecoin from '@web3icons/react/icons/networks/NetworkLitecoin';
import NetworkMantle from '@web3icons/react/icons/networks/NetworkMantle';
import NetworkNearProtocol from '@web3icons/react/icons/networks/NetworkNearProtocol';
import NetworkOptimism from '@web3icons/react/icons/networks/NetworkOptimism';
import NetworkPolygon from '@web3icons/react/icons/networks/NetworkPolygon';
import NetworkScroll from '@web3icons/react/icons/networks/NetworkScroll';
import NetworkSolana from '@web3icons/react/icons/networks/NetworkSolana';
import NetworkSonic from '@web3icons/react/icons/networks/NetworkSonic';
import NetworkStarknet from '@web3icons/react/icons/networks/NetworkStarknet';
import NetworkStellar from '@web3icons/react/icons/networks/NetworkStellar';
import NetworkSui from '@web3icons/react/icons/networks/NetworkSui';
import NetworkThorchain from '@web3icons/react/icons/networks/NetworkThorchain';
import NetworkTon from '@web3icons/react/icons/networks/NetworkTon';
import NetworkTron from '@web3icons/react/icons/networks/NetworkTron';
import NetworkXrp from '@web3icons/react/icons/networks/NetworkXrp';
import NetworkZksync from '@web3icons/react/icons/networks/NetworkZksync';
import type { ChainId } from '@/lib/vizzor/chains';

type Icon = ComponentType<{ variant?: 'branded' | 'mono' | 'background'; size?: number | string }>;

const ICONS: Record<ChainId, Icon> = {
  ethereum: NetworkEthereum,
  solana: NetworkSolana,
  bitcoin: NetworkBitcoin,
  base: NetworkBase,
  arbitrum: NetworkArbitrumOne,
  optimism: NetworkOptimism,
  polygon: NetworkPolygon,
  bnb: NetworkBinanceSmartChain,
  avalanche: NetworkAvalanche,
  tron: NetworkTron,
  ton: NetworkTon,
  sui: NetworkSui,
  aptos: NetworkAptos,
  xrp: NetworkXrp,
  linea: NetworkLinea,
  zksync: NetworkZksync,
  scroll: NetworkScroll,
  blast: NetworkBlast,
  mantle: NetworkMantle,
  sonic: NetworkSonic,
  hyperevm: NetworkHyperEvm,
  gnosis: NetworkGnosis,
  celo: NetworkCelo,
  thorchain: NetworkThorchain,
  litecoin: NetworkLitecoin,
  stellar: NetworkStellar,
  cardano: NetworkCardano,
  near: NetworkNearProtocol,
  algorand: NetworkAlgorand,
  hedera: NetworkHederaHashgraph,
  starknet: NetworkStarknet,
};

export function ChainMark({ chain, size = 28 }: { chain: ChainId; size?: number }) {
  const Icon = ICONS[chain];
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
