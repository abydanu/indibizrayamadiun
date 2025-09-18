import { paketData } from '@/features/smartsync-dashboard/data/paket-data'

const paket_indibiz = paketData.map(paket => {
  const price = parseFloat(paket.harga_pkt_ppn);
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return {
    name: `[${paket.bandwith_paket}MB] - ${paket.nama_paket} (${formattedPrice})`,
    price: price,
    id: paket.id,
    bandwidth: paket.bandwith_paket,
    originalName: paket.nama_paket
  };
})

// Keep original static data as fallback
// const staticPaketIndibiz = [
//   {
//     name: '30MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (477K)',
//     price: 477000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (477K)',
//     price: 477000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (477K)',
//     price: 477000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (477K)',
//     price: 477000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (497K)',
//     price: 497000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + 2 ATTACKDNS DNS MAPS PBS 70% (497K)',
//     price: 497000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (497K)',
//     price: 497000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (497K)',
//     price: 497000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (497K)',
//     price: 497000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (524K)',
//     price: 524000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + 2 ATTACKDNS DNS MAPS PBS 70% (524K)',
//     price: 524000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (524K)',
//     price: 524000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (524K)',
//     price: 524000,
//   },
//   {
//     name: '30MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (524K)',
//     price: 524000,
//   },
//   {
//     name: '75MBPS HSI BIZINS + ATTACKDNS 5X100 DNS MAPS PBS 70% (879K)',
//     price: 879000,
//   },
//   {
//     name: '75MBPS HSI BIZINS + ATTACKDNS 10X100 DNS MAPS PBS 70% (879K)',
//     price: 879000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (879K)',
//     price: 879000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (879K)',
//     price: 879000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (879K)',
//     price: 879000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (920K)',
//     price: 920000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + 2 ATTACKDNS DNS MAPS PBS 70% (920K)',
//     price: 920000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (920K)',
//     price: 920000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (920K)',
//     price: 920000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (920K)',
//     price: 920000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (963K)',
//     price: 963000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + 2 ATTACKDNS DNS MAPS PBS 70% (963K)',
//     price: 963000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (963K)',
//     price: 963000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (963K)',
//     price: 963000,
//   },
//   {
//     name: '75MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (963K)',
//     price: 963000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + ATTACKDNS 5X100 DNS MAPS PBS 70% (1.260K)',
//     price: 1260000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + ATTACKDNS 10X100 DNS MAPS PBS 70% (1.260K)',
//     price: 1260000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (1.260K)',
//     price: 1260000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (1.260K)',
//     price: 1260000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (1.260K)',
//     price: 1260000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (1.323K)',
//     price: 1323000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + 2 ATTACKDNS DNS MAPS PBS 70% (1.323K)',
//     price: 1323000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (1.323K)',
//     price: 1323000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (1.323K)',
//     price: 1323000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (1.323K)',
//     price: 1323000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + 1 ATTACKD DNS MAPS PBS 70% (1.386K)',
//     price: 1386000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + 2 ATTACKDNS DNS MAPS PBS 70% (1.386K)',
//     price: 1386000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + OCA DNS MAPS PBS 70% (1.386K)',
//     price: 1386000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + F.UP DNS MAPS PBS 70% (1.386K)',
//     price: 1386000,
//   },
//   {
//     name: '100MBPS HSI BIZINS BASIC + UTTY CONVINDI 2X100 DNS MAPS PBS 70% (1.386K)',
//     price: 1386000,
//   },
// ];

// Combine dynamic paket data with static fallback data
// const combinedPaketIndibiz = [...paket_indibiz, ...staticPaketIndibiz];

const combinedPaketIndibiz = paket_indibiz

export default combinedPaketIndibiz