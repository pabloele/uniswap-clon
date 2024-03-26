const Web3 = require('web3');
const { ethers } = require('ethers');
const routerAbi = require('./routerAbi.json'); // Asegúrate de importar el ABI del contrato de router
const routerAddress = 'TU_DIRECCION_DEL_CONTRATO_ROUTER'; // Ingresa la dirección del contrato de router
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // Dirección del token WETH
const privateKey = 'TU_CLAVE_PRIVADA'; // Clave privada de tu cuenta
const provider = new Web3.providers.HttpProvider(
  'https://optimism-sepolia.infura.io/v3/0273f1078eaa4d7cba8e241a7e2ef359'
); // Cambia a tu proveedor de Ethereum
const web3 = new Web3(provider);

// Crea una instancia del contrato de router
const routerContract = new web3.eth.Contract(routerAbi, routerAddress);

// Define los parámetros para agregar liquidez
const token = WETH;
const amountTokenDesired = web3.utils.toWei('100', 'ether'); // 100 tokens
const amountTokenMin = 0; // Cantidad mínima de tokens aceptable
const amountETHMin = web3.utils.toWei('0.1', 'ether'); // 0.1 ETH
const to = 'TU_DIRECCION_DESTINO'; // Dirección donde se enviarán los tokens LP
const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos desde ahora

// Crea la transacción para agregar liquidez con ETH
const tx = routerContract.methods.addLiquidityETH(
  token,
  amountTokenDesired,
  amountTokenMin,
  amountETHMin,
  to,
  deadline
);
const encodedABI = tx.encodeABI();

// Firme y envíe la transacción
web3.eth.accounts
  .signTransaction(
    {
      to: routerAddress,
      data: encodedABI,
      gas: 3000000, // Ajusta el límite de gas según sea necesario
      gasPrice: '20000000000', // Ajusta el precio del gas según sea necesario
      value: amountETHMin, // Envía la cantidad de ETH requerida para la transacción
    },
    privateKey
  )
  .then((signed) => {
    web3.eth
      .sendSignedTransaction(signed.rawTransaction)
      .on('receipt', console.log);
  });
