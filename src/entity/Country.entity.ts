import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "country", schema: "cesar_tours" })
export class Country {
    @PrimaryGeneratedColumn("uuid")
    country_id: string;
    
    @Column ()
    country: string;

    @CreateDateColumn({ name: "created_at" })
    createAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updateAt: Date;
}