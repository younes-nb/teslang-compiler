export function formatSyntaxErrors(error: any) {
  const token = error.token;
  const message = error.message;
  const expected = message
    .match(/(?<=A ).*(?= based on:)/g)
    .map((s: string) => s.replace(/\s+token/i, ''));
  if (
    expected.indexOf('ws') > -1 &&
    expected.indexOf('nl') > -1 &&
    expected.length > 2
  ) {
    expected.splice(expected.indexOf('ws'), 1);
    expected.splice(expected.indexOf('nl'), 1);
  } else if (expected.indexOf('ws') > -1 && expected.length > 1) {
    expected.splice(expected.indexOf('ws'), 1);
  } else if (expected.indexOf('nl') > -1 && expected.length > 1) {
    expected.splice(expected.indexOf('nl'), 1);
  }

  for (const i in expected) {
    if (expected[i] === 'ws') {
      expected[i] = 'white space';
    } else if (expected[i] === 'nl') {
      expected[i] = 'new line';
    }
  }
  let unexpected: string;
  if (token.type === 'nl') {
    unexpected = 'new line';
  } else if (token.type === 'ws') {
    unexpected = 'white space';
  } else {
    unexpected = token.value;
  }
  let newMessage = '    ';
  if (expected && expected.length) {
    newMessage += `expected ${[
      ...new Set(expected),
    ]} but got ${unexpected} instead`;
  } else {
    newMessage += `Unexpected ${unexpected}`;
  }
  console.log(
    '\x1b[31m',
    `Syntax Error at line ${token.line} col ${token.col} :`
  );
  console.log('\x1b[31m', newMessage);
}
