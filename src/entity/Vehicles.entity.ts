import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "vehicles", schema: "cesar_tours" })
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  capacity: number;

  @Column()
  luggage_capacity: number;

  @Column({ type: "decimal", precision: 7, scale: 2 })
  price_per_km: number;

  @Column()
  img_url: string;

  @Column()
  status: boolean;

  @CreateDateColumn({ name: "created_at" })
  createAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
}