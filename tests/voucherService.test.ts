import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";
import { conflictError } from "utils/errorUtils";
import { amountFactory } from "./factories/amountFactory";
import { voucherFactory } from "./factories/voucherFactory";

describe("Test function createVoucher", () => {
  it("should be able to create a voucher", async () => {
    const voucher = voucherFactory.unusedVoucher();
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(() => {
      return undefined
    });

    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { });

    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(voucherRepository.createVoucher).toBeCalledTimes(1);
  });

  it("should not be able to create a voucher", async () => {
    const voucher = voucherFactory.unusedVoucher();
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    const result = voucherService.createVoucher(voucher.code, voucher.discount);

    await expect(result).rejects.toEqual(conflictError("Voucher already exist."));

    expect(voucherRepository.createVoucher).not.toBeCalled();
  });
})

describe("Test function applyVoucher", () => {
  it("should not be able to apply a voucher because it doesn't exist", () => {
    const voucher = voucherFactory.unusedVoucher();

    const amount = amountFactory(100 , 1000);
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(() => {
      return undefined
    });

    const result = voucherService.applyVoucher(voucher.code, amount);

    expect(result).rejects.toEqual(conflictError("Voucher does not exist."));
  });

  it("should not be able to apply a voucher because amount is less than 100", async () => {
    const voucher = voucherFactory.unusedVoucher();

    const amount = amountFactory(1 , 99);
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result).toEqual({
      amount,
      discount: voucher.discount,
      finalAmount: amount,
      applied: false
    });
  });

  it("should not be able to apply a voucher because voucher was already used", async () => {
    const voucher = voucherFactory.usedVoucher();

    const amount = amountFactory(100 , 1000);
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result).toEqual({
      amount,
      discount: voucher.discount,
      finalAmount: amount,
      applied: false
    });
  });

  it("should be able to apply a voucher", async () => {
    const voucher = voucherFactory.unusedVoucher();

    const amount = amountFactory(100 , 1000);

    const finalAmount = amount - (amount * voucher.discount/100);
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { });

    const result = await voucherService.applyVoucher(voucher.code, amount);

    expect(result).toEqual({
      amount,
      discount: voucher.discount,
      finalAmount,
      applied: true
    });
  });
})