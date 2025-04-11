import request from "supertest";
import app from "../src/index";
import { dataSource } from "../src/config/ormconfig";

describe("Vehicles", () => {
  beforeAll(async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  });

  afterAll(async () => {
    await dataSource.destroy(); // cierra la conexión
  });

  it("should return a list of vehicles", async () => {
    const res = await request(app).get("/api/vehicle/getVehicles");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return 404", async () => {
    const res = await request(app).get("/api/vehicle/getVehicles/taho");

    expect(res.status).toBe(404);
  });

  it("should return a list of vehicles filter by capacity en luggage", async () => {
    const res = await request(app).get(
      "/api/vehicle/getVehicles?capacity=1&luggage_capacity=1"
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
