import { Page } from "../data/app";
import { resolvePage } from "./app";

const pages: Page[] = [
  { urlPattern: "/home" },
  { urlPattern: "/pattern1" },
  { urlPattern: "/pattern1/" },
];

test("resolvePage correctly resolves pages", () => {
  expect(resolvePage("/pattern1", pages)).toEqual({ page: pages[1] });
  expect(resolvePage("/pattern1/", pages)).toEqual({ page: pages[2] });
  expect(resolvePage("/pattern1/123", pages)).toEqual({
    page: pages[2],
    params: "123",
  });
  expect(resolvePage("/pattern2", pages)).toEqual({});
});
