import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Country } from "./Country.entity";

@Entity({ name: "customer", schema: "cesar_tours" })
export class Customer {
    @PrimaryGeneratedColumn("uuid")
    customer_id: string;

    @Column()
    name: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({name:"optional_phone"})
    optionalPhone: string;

    @ManyToOne(() => Country)
    @JoinColumn({ name: "country_id" })
    country: Country;

    @Column({ name: "country_id" })
    countryId: string;

    @CreateDateColumn({ name: "created_at" })
    createAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updateAt: Date;
}