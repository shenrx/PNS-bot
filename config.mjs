export default {
  RPC_URL: "https://testnet.dplabs-internal.com", 
  CONTROLLER_ADDRESS: "0x51be1ef20a1fd5179419738fc71d95a8b6f8a175", //  ETHRegistrarController
  DURATION: 31536000,
  RESOLVER: "0x9a43dcA1C3BB268546b98eb2AB1401bFc5b58505",
  DATA: [],
  SHOW_FULL_ADDRESS: false,
  REVERSE_RECORD: false,  // rekomendasi false
  OWNER_CONTROLLED_FUSES: 0, // rekomendasi 0, kalau 1 tidak disarankan
  MAX_CONCURRENCY: 5, // Rekomendasi 5, agar hemat RAM dan Stabilitas
  REG_PER_KEY: 3 // 3 pendaftaran domain dalam 1 wallet, lalu sleep 5 menit dan mengulang kembali
}; 
