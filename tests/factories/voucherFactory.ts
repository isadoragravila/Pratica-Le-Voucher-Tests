import { faker } from "@faker-js/faker";

function unusedVoucher() {
  return {
    id: faker.datatype.number({min: 1, max: 10000}),
    code: faker.random.alphaNumeric(10),
    discount: faker.datatype.number({min: 1, max: 100}),
    used: false
  }
}

function usedVoucher() {
  return {
    id: faker.datatype.number({min: 1, max: 10000}),
    code: faker.random.alphaNumeric(10),
    discount: faker.datatype.number({min: 1, max: 100}),
    used: true
  }
}

export const voucherFactory = {
  unusedVoucher,
  usedVoucher
}