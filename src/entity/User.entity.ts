import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user", schema: "cesar_tours" })

export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updateAt: Date;
}