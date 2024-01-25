import {calculateWorkedHours} from "./utils";

// Test case 1: Calculate worked hours for a full day
test("Should calculate worked hours for a full day", () => {
  const date = "2022-01-01";
  const points = ["09:00:00", "12:00:00", "13:00:00", "18:00:00"];
  const result = calculateWorkedHours(date, points);
  expect(result).toBe("PT8H");
});

test("Should calculate worked hours fractioned", () => {
  const date = "2022-01-01";
  const points = ["09:30:30", "12:00:00", "13:00:00", "17:45:00"];
  const result = calculateWorkedHours(date, points);
  expect(result).toBe("PT7H14M30S");
});

test("Should fail due to invalid lunch break time", () => {
  const date = "2022-01-01";
  const points = ["09:00:00", "12:00:00", "12:45:00", "18:00:00"];
  expect(() => {calculateWorkedHours(date, points)}).toThrow(Error("Invalid lunch break"));
});

test("Should calculate worked hours for a half day", () => {
  const date = "2022-01-02";
  const points = ["09:00:00", "12:00:00"];
  const result = calculateWorkedHours(date, points);
  expect(result).toBe("PT3H");
});

test("Should throw an error for invalid number of points", () => {
  const date = "2022-01-03";
  const points = ["09:00:00", "12:00:00", "13:00:00", "15:00:00", "16:00:00", "18:00:00"];
  expect(() => {calculateWorkedHours(date, points)}).toThrow(Error("Invalid number of points"));
});