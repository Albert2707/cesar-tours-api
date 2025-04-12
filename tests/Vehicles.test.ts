import request from "supertest";
import app from "../src/index";
import { dataSource } from "../src/config/ormconfig";
import { Vehicle } from "../src/entity/Vehicles.entity";

describe("Vehicles", () => {
  beforeAll(async () => {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    // Inserta un vehículo de prueba en la base de datos
    const vehicleRepository = dataSource.getRepository(Vehicle);
    const testVehicle = vehicleRepository.create({
      brand: "Toyota",
      model: "Corolla",
      capacity: 5,
      luggage_capacity: 3,
      price_per_km: 0.75,
      img_url: "https://example.com/image.jpg",
      status: true,
    });
    await vehicleRepository.save(testVehicle);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Cierra la conexión
  });

  it("should return a list of vehicles", async () => {
    const res = await request(app).get("/api/vehicle/getVehicles");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return 404 for an invalid route", async () => {
    const res = await request(app).get("/api/vehicle/getVehicles/taho");

    expect(res.status).toBe(404);
  });

  it("should return a list of vehicles filtered by capacity and luggage", async () => {
    const res = await request(app).get(
      "/api/vehicle/getVehicles?capacity=1&luggage_capacity=1"
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
