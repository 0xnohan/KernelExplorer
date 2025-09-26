import { Monitor, Zap, ArrowLeftRight, Users } from 'lucide-vue-next';

export const dashboardStats = [
  {
    title: "Latest Block",
    value: "18 542 891",
    change: "+1 block/15s",
    changeType: "increase",
    icon: Monitor,
    color: "blue"
  },
  {
    title: "Total Transactions",
    value: "5",
    change: "+150 TPS",
    changeType: "increase",
    icon: ArrowLeftRight,
    color: "purple"
  },
  {
    title: "Network Hashrate",
    value: "892.5 TH/s",
    change: "+2.3% today",
    changeType: "increase",
    icon: Zap,
    color: "green"
  },
  {
    title: "Active Addresses",
    value: "1.2M",
    change: "+5.7% week",
    changeType: "increase",
    icon: Users,
    color: "orange" 
  },
];

export const latestBlocks = [
  { height: 18542891, timestamp: '2025-01-15T11:30:15Z', txns: 247, miner: '0x742d35cc66...cc66', block_size: 15000000, block_limit: 30000000, reward: 2.5 },
  { height: 18542890, timestamp: '2025-01-15T11:30:00Z', txns: 189, miner: '0x8ba1f10955...f0955', block_size: 12450000, block_limit: 30000000, reward: 2.5 },
  { height: 18542889, timestamp: '2025-01-15T11:29:45Z', txns: 312, miner: '0x742d35cc66...cc66', block_size: 18570000, block_limit: 30000000, reward: 2.5 },
  { height: 18542888, timestamp: '2025-01-15T11:29:30Z', txns: 156, miner: '0x95ad61b0a1...b0a1', block_size: 9870000, block_limit: 30000000, reward: 2.5 },
  { height: 18542887, timestamp: '2025-01-15T11:29:15Z', txns: 203, miner: '0x8ba1f10955...f0955', block_size: 13230000, block_limit: 30000000, reward: 2.5 },
];

export const latestTransactions = [
  { hash: '0xabc123def45678...', from: '0x742d35...', to: '0x8ba1f1...', amount: 1.5, fee: 0.000525, status: 'success', block_number: 18542891 },
  { hash: '0xdef456abc78901...', from: '0x95ad61...', to: '0x742d35...', amount: 0.25, fee: 0.000483, status: 'success', block_number: 18542891 },
  { hash: '0x1234567890abcd...', from: '0x8ba1f1...', to: '0x95ad61...', amount: 3.2, fee: 0.000567, status: 'success', block_number: 18542890 },
  { hash: '0x789abc123def45...', from: '0x742d35...', to: '0x8ba1f1...', amount: 0.1, fee: 0.000462, status: 'failed', block_number: 18542890 },
  { hash: '0x456def789abc12...', from: '0x95ad61...', to: '0x742d35...', amount: 5.0, fee: 0.000588, status: 'success', block_number: 18542889 },
];

// src/data/mockData.js

export const mockBlockDetails = {
  block_number: 27,
  hash: '00000ff2a980e1ee858fa39b20fc9842d4de473acdeaf03f275c7cc0e5f00c',
  previous_hash: '000000ae55f6d326da82e9d1179cf8be739ae71fb496554428eb2ed47df54eb',
  confirmations: 1,
  transaction_count: 2,
  size: 393, // en octets
  merkle_root: '5d621b978b7e2343d4e126f3903ac7ea1b4806414491ac43c8e31b48b9742b6a',
  target_bits: '06d7031e',
  nonce: '630,570',
  timestamp: '2025-09-24T04:08:54Z',
  transactions: [
    {
      hash: 'fd88877742952dd9c67fca26af063b99cc04ad84aafb9b541126481dcb0f8cb8c3',
      inputs: [{ address: 'Coinbase' }],
      outputs: [
        { address: 'kaMRsyvKbJ2JVYV52ptMbC5HSY8TBYLSdS', amount: 50.25 }
      ]
    },
    {
      hash: 'f8fbbef1b4254574fe79aa7669f3642323bcdeb7fa17a36684acfc8f768e1eda9',
      inputs: [{ address: 'From: 3aff336aca07...' }],
      outputs: [
        { address: 'kKQLy7eceC7DJwE1yyZ1EUMTRDMQV12PG', amount: 23 },
        { address: 'kaMRsyvKbJ2JVYV52ptMbC5HSY8TBYLSdS', amount: 26.75 }
      ]
    }
  ]
};

export const mockAddressDetails = {
  address: 'kaMRsyvKbJ2JVYV52ptMbC5HSY8TBYLSdS',
  balance: 1108,
  unspent_tx_count: 23,
  total_tx_count: 29,
  total_received: 1408,
  total_sent: '---',
  utxos: [
    {
      hash: 'ad291561e5491054ef3c255a3952f820304b29f30787a611211b2540ee0545a6',
      inputs: [{ address: 'Coinbase' }],
      outputs: [{ address: 'kaMRsyvKbJ2JVYV52ptMbC5HSY8TBYLSdS', amount: 50 }]
    },
    {
      hash: '69c392ff39bf20bc97f5953b1f8c523f914a69461e1f40cb3e2da3adc50259',
      inputs: [{ address: 'Coinbase' }],
      outputs: [{ address: 'kaMRsyvKbJ2JVYV52ptMbC5HSY8TBYLSdS', amount: 50 }]
    }
  ]
};