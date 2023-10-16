import React from "react";
import { render } from "@testing-library/react";
import MyMap from "./index";

describe("MyMap Component test cases", () => {
  test("renders map component", () => {
    const mockupData = [
      {
        name: "CN",
        count: 2,
      },
      {
        name: "MX",
        count: 1,
      },
      {
        name: "CA",
        count: 1,
      },
    ];
    const { container } = render(
      <MyMap className="mt-2" deviceData={[...mockupData]} />
    );
    expect(container).toMatchSnapshot();
  });
});
