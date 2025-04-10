import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "locations", schema: "cesar_tours" })
export class Location {
    @PrimaryGeneratedColumn("uuid")
    location_id: string;

    @Column()
    formatted_address: string

    @Column({type:"decimal", precision: 10, scale: 8})
    lat: number

    @Column({type:"decimal", precision: 10, scale: 8})
    lng: number

    @CreateDateColumn({ name: "created_at" })
    createAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updateAt: Date;
}