import { program } from 'commander';
import { ConversionService } from './services/conversion.service.js';
import { AwesomeApiRepository } from './repositories/AwesomeApiRepository.js';
import { HistoryRepository } from './repositories/history.repository.js';

async function main() {
  try {
    program
      .name('tech-converter')
      .description('CLI tool for currency conversion')
      .version('1.0.0');

    program
      .command('convert')
      .description('Convert an amount from one currency to another')
      .requiredOption('-f, --from <symbol>', 'Source currency (e.g., USD)')
      .requiredOption('-t, --to <symbol>', 'Target currency (e.g., BRL)')
      .requiredOption('-a, --amount <number>', 'Amount to convert', (val) => parseFloat(val))
      .action(async (options) => {
        const exchangeRepo = new AwesomeApiRepository();
        const historyRepo = new HistoryRepository();
        const service = new ConversionService(exchangeRepo, historyRepo);

        const result = await service.convert({
          from: options.from,
          to: options.to,
          amount: options.amount
        });

        if (result.success && result.data) {
          console.log('\n--- Conversion Result ---');
          console.log(`From: ${result.data.from}`);
          console.log(`To: ${result.data.to}`);
          console.log(`Amount: ${result.data.amount}`);
          console.log(`Rate: ${result.data.rate}`);
          console.log(`Result: ${result.data.result.toFixed(2)}`);
          console.log('--------------------------\n');
        } else {
          console.error(`\nError: ${result.error}\n`);
          process.exit(1);
        }
      });

    await program.parseAsync(process.argv);
  } catch (err) {
    console.error('FATAL ERROR:', err instanceof Error ? err.message : 'An unexpected error occurred');
    process.exit(1);
  }
}

main();