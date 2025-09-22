import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

if (process.argv.length < 4) {
  console.error('Usage: tsx scripts/write_keypair_from_base58.ts <base58-secret> <output-path>');
  process.exit(1);
}

const secretBase58 = process.argv[2];
const outPath = process.argv[3];

try {
  const secret = bs58.decode(secretBase58);
  if (secret.length !== 64) {
    throw new Error(`Expected 64-byte secret key, got ${secret.length}`);
  }
  const kp = Keypair.fromSecretKey(secret);
  const dir = dirname(outPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(Array.from(kp.secretKey)));
  console.log(kp.publicKey.toBase58());
} catch (e) {
  console.error('Failed to write keypair:', e);
  process.exit(2);
}
