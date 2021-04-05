'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ESCAPE_CHAR = '\\';

const DEFAULT_SEPARATOR = ';';

function isEscaping(substring) {
  return substring.slice(-1) === ESCAPE_CHAR;
}

function split(line = '', separator = DEFAULT_SEPARATOR) {
  return Array.from(line).reduce(
    (substrings, char) => {
      const substring = substrings[substrings.length - 1];

      // Only splits when is separator char and isn't escaping.
      if (isEscaping(substring) || char !== separator) {
        // Concat char to last `substring`.
        substrings[substrings.length - 1] = substring.concat(char);

        return substrings;
      }

      return substrings.concat('');
    },
    [''],
  );
}

const NUMBER = /^\d+(\.\d+)?$/;

const DATE_TIME = /^(\d{2})\/(\d{2})\/(\d{4})( (\d{2}):(\d{2}):(\d{2}))?$/;

function isDate(value = '') {
  return DATE_TIME.test(value);
}

const SECOND = 1000;

const MINUTE = 60 * SECOND;

function getDateWithoutTimezone(date = new Date()) {
  const timezone = date.getTimezoneOffset() * MINUTE;
  return new Date(date.getTime() - timezone);
}

function formatDate(value = '') {
  const [, DD, MM, YYYY, , HH = '00', mm = '00', SS = '00'] = DATE_TIME.exec(value);
  return getDateWithoutTimezone(new Date(+YYYY, +MM + 1, +DD, +HH, +mm, +SS)).toISOString();
}

function transform(line, separator = DEFAULT_SEPARATOR) {
  const cells = split(line, separator).map((cell) => {
    if (NUMBER.test(cell)) return cell;
    if (isDate(cell)) {
      return formatDate(cell);
    }
    return `"${cell.replace(/"/g, '\\"')}"`;
  });

  return cells.join(separator) + '\n';
}

function parseCSV(input, output) {
  const file = readline.createInterface({
    input: fs.createReadStream(input, {
      encoding: 'latin1',
      flags: 'r',
    }),
    output: fs.createWriteStream(output, {
      encoding: 'utf-8',
      flags: 'w',
    }),
    terminal: false,
  });

  file.on('line', function (line) {
    this.output.write(transform(line));
  });

  const handleClose = () => {
    console.log('Finished!');
    process.exit(0);
  };

  file.on('SIGINT', handleClose).on('close', handleClose);
}

parseCSV(
  path.resolve('./TA_PRODUTO_SAUDE_SITE.csv'),
  path.resolve('./data.csv'),
);
