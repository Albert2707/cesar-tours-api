import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "vehicles", schema: "cesar_tours" })
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  make: string;
  @Column()
  model: string;
  @Column()
  capacity: number;
  @Column()
  luggage_capacity: number;
  @Column({type:"decimal", precision:7, scale:2})
  price_per_km: string;
  @Column()
  img_url: string;
  @Column()
  status: boolean;
}
