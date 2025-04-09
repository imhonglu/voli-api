import type { Request } from "@/types/request.interface";
import { hasContentTypeHeader } from "./has-content-type-header";

it("should return true when content-type header exists with a value", () => {
  const headers: Request["headers"] = {
    "content-type": "application/json",
  };

  expect(hasContentTypeHeader(headers)).toBe(true);
});

it("should return false when content-type header exists but value is empty", () => {
  const headers: Request["headers"] = {
    "content-type": "",
  };

  expect(hasContentTypeHeader(headers)).toBe(false);
});

it("should return false when content-type header does not exist", () => {
  const headers: Request["headers"] = {};

  expect(hasContentTypeHeader(headers)).toBe(false);
});

it("should return false when content-type header is undefined", () => {
  const headers: Request["headers"] = {
    "content-type": undefined,
  };

  expect(hasContentTypeHeader(headers)).toBe(false);
});
