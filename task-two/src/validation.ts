/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import fs from 'fs';
import validator from 'email-validator';
import * as domainValidator from 'email-domain-validator';
console.log(domainValidator.validate('anunihuebuka01@grail.com'));

async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  const emailList = fs.readFileSync(inputPath[0], 'utf-8').trim().split('\n');

  const validatedEmails = emailList
    .map((email) => {
      if (validator.validate(email)) {
        return email;
      }
    })
    .filter((email) => email !== undefined);

  const validEmails: any[] = validatedEmails.map((email: any) =>
    domainValidator.validate(email),
  );

  const resolvedPromises = await Promise.all(validEmails);
  const validEmailAddresses = resolvedPromises
    .map((promise, index) => {
      if (promise.isValidDomain) {
        return validatedEmails[index];
      }
    })
    .filter((email) => email !== undefined);

  validEmailAddresses.unshift(emailList[0]);

  let output = validEmailAddresses.join('\n');

  fs.writeFile(outputFile, output, (err) => {
    if (err) console.log(err);
  });
  return output;
}
validateEmailAddresses(
  ['fixtures/inputs/small-sample.csv'],
  'report-validation.csv',
).then((result) => console.log(result));

export default validateEmailAddresses;
