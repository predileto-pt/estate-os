import "@testing-library/jest-dom";

// MSW server
import { server } from "./src/__tests__/mocks/server";
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
