import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1734314640915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO cesar_tours.country (country_id, country) VALUES
        ('DO', 'Dominican Republic'),
        ('US', 'United States'),
        ('CA', 'Canada'),
        ('MX', 'Mexico'),
        ('BR', 'Brazil'),
        ('AR', 'Argentina'),
        ('DE', 'Germany'),
        ('FR', 'France'),
        ('JP', 'Japan'),
        ('AU', 'Australia'),
        ('GB', 'United Kingdom'),
        ('IT', 'Italy'),
        ('ES', 'Spain'),
        ('IN', 'India'),
        ('CN', 'China'),
        ('RU', 'Russia'),
        ('ZA', 'South Africa'),
        ('NG', 'Nigeria'),
        ('EG', 'Egypt'),
        ('KR', 'South Korea'),
        ('SE', 'Sweden'),
        ('NO', 'Norway'),
        ('FI', 'Finland'),
        ('NL', 'Netherlands'),
        ('PL', 'Poland'),
        ('CH', 'Switzerland'),
        ('BE', 'Belgium'),
        ('AT', 'Austria'),
        ('SG', 'Singapore'),
        ('TH', 'Thailand'),
        ('PH', 'Philippines'),
        ('ID', 'Indonesia'),
        ('MY', 'Malaysia'),
        ('PK', 'Pakistan'),
        ('UA', 'Ukraine'),
        ('KE', 'Kenya'),
        ('CL', 'Chile'),
        ('PE', 'Peru'),
        ('CO', 'Colombia'),
        ('VE', 'Venezuela')
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
