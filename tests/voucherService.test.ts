import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";
import { conflictError } from "utils/errorUtils";

describe("Test function createVoucher", () => {
  it("should be able to create a voucher", async () => {
    const voucher = {
      id: 1,
      code: "randomCode",
      discount: 10,
      used: false
    }
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce(() => {
      return undefined
    });

    jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { });

    await voucherService.createVoucher(voucher.code, voucher.discount);

    expect(voucherRepository.createVoucher).toBeCalledTimes(1);
  });

  it("should not be able to create a voucher", async () => {
    const voucher = {
      id: 1,
      code: "randomCode",
      discount: 10,
      used: false
    }
    
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    const result = voucherService.createVoucher(voucher.code, voucher.discount);

    await expect(result).rejects.toEqual(conflictError("Voucher already exist."));

    expect(voucherRepository.createVoucher).not.toBeCalled();
  });
})