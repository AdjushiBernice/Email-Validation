/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import fs from 'fs';
import * as EmailValidator from 'email-validator';
function analyseFiles(inputPaths: string[], outputPath: string) {
  const emailsFromFs = fs.readFileSync(inputPaths[0], 'utf-8');
  const emailsinArray = emailsFromFs.trim().split('\n');
  const firstChar = emailsinArray.shift();
  const validatedEmails = emailsinArray.filter((email) => {
    return EmailValidator.validate(email) === true;
  });
  const categories: any = {};
  const domainsArr = [];
  for (const emails of validatedEmails) {
    const domains = emails.split('@')[1];
    domainsArr.push(domains);
  }
  console.log(domainsArr);
  for (let i = 0; i < domainsArr.length; i++) {
    if (categories[domainsArr[i]]) {
      categories[domainsArr[i]] += 1;
    } else {
      categories[domainsArr[i]] = 1;
    }
  }
  const valid_domains: string[] = Object.keys(categories);

  const bigObject = {
    'valid-domains': valid_domains,
    totalEmailsParsed: emailsinArray.length,
    totalValidEmails: validatedEmails.length,
    categories: categories,
  };
  const finalResult = JSON.stringify(bigObject, null, 2);
  fs.writeFileSync(outputPath, finalResult);
  return finalResult;
}
console.log(
  analyseFiles(['./fixtures/inputs/small-sample.csv'], 'report-analysis.json'),
);

export default analyseFiles;
