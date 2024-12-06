import { MigrationInterface, QueryRunner } from "typeorm";

export class NuevaMigracion1733403824609 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO cesar_tours.country (country_id, country) VALUES
            (uuid_generate_v4(), 'Dominican Republic'),
            (uuid_generate_v4(), 'United States'),
            (uuid_generate_v4(), 'Canada'),
            (uuid_generate_v4(), 'Mexico'),
            (uuid_generate_v4(), 'Brazil'),
            (uuid_generate_v4(), 'Argentina'),
            (uuid_generate_v4(), 'Germany'),
            (uuid_generate_v4(), 'France'),
            (uuid_generate_v4(), 'Japan'),
            (uuid_generate_v4(), 'Australia')
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM cesar_tours.country 
            WHERE country IN (
              'Dominican Republic',
              'United States',
              'Canada',
              'Mexico',
              'Brazil',
              'Argentina',
              'Germany',
              'France',
              'Japan',
              'Australia'
            )
          `);
    }

}
