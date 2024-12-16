import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Country } from "./Country.entity";
import { Vehicle } from "./Vehicles.entity";
import { Customer } from "./Customer.entity";

type TripType = "one_way" | "round_trip";
type PaymentMethod = "Cash" | "Card";
@Entity({ name: "orders", schema: "cesar_tours" })
export class Order {
    @PrimaryGeneratedColumn("uuid")
    order_num: string;

    @Column()
    origin: string;

    @Column()
    destination: string;

    @Column({ type: "enum", enum: ["one_way", "round_trip"], default: "one_way" })
    trip_type: TripType

    @Column()
    passengers: number;

    @Column()
    luggage: number;

    @Column({ name: "departure_date", type: 'date' })
    departureDate: string;

    @Column({ name: "departure_hour" })
    departureHours: string

    @Column({ name: "return_date", nullable: true, type: 'date' })
    returnDate: string;

    @Column({ name: "return_hour", nullable: true })
    returnHours: string

    @ManyToOne(() => Country)
    @JoinColumn({ name: "country_id" })
    country: Country;

    @Column({ name: "country_id" })
    countryId: string;

    @Column()
    distance: string

    @Column()
    duration: string

    @ManyToOne(() => Vehicle)
    @JoinColumn({ name: "vehicle_id" })
    vehicle: Vehicle;

    @Column({ name: "vehicle_id" })
    vehicleId: string;

    @Column({ default: 0 })
    status: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: "customer_id" })
    customer: Customer;

    @Column({ name: "customer_id" })
    customerId: string;

    @Column()
    airline: string;

    @Column()
    flight_number: string;

    @Column({ name: "additional_notes", nullable: true })
    additionalNotes: string

    @Column({ name: "payment_method", type: "enum", enum: ["Cash", "Card"], default: "Cash" })
    paymentMethod: PaymentMethod;

    @Column()
    total: number

    @CreateDateColumn({ name: "created_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updateAt: Date;
}