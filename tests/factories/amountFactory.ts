import { faker } from "@faker-js/faker";

export function amountFactory(min: number, max: number) {
  return Number(faker.finance.amount(min, max));
}