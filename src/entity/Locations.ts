import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "locations", schema: "cesar_tours" })
export class Location {
    @PrimaryGeneratedColumn("uuid")
    location_id: string;

    @Column({default:"N/A"})
    formatted_address: string

    @Column({type:"decimal", precision: 10, scale: 8, default:0})
    lat: number

    @Column({type:"decimal", precision: 10, scale: 8, default:0})
    lng: number

    @CreateDateColumn({ name: "created_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updateAt: Date;
}