"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyMigration1734314640915 = void 0;
class MyMigration1734314640915 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
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
        'Australia',
        'United Kingdom',
        'Italy',
        'Spain',
        'India',
        'China',
        'Russia',
        'South Africa',
        'Nigeria',
        'Egypt',
        'South Korea',
        'Sweden',
        'Norway',
        'Finland',
        'Netherlands',
        'Poland',
        'Switzerland',
        'Belgium',
        'Austria',
        'Singapore',
        'Thailand',
        'Philippines',
        'Indonesia',
        'Malaysia',
        'Pakistan',
        'Ukraine',
        'Kenya',
        'Chile',
        'Peru',
        'Colombia',
        'Venezuela'
      )
    `);
        });
    }
}
exports.MyMigration1734314640915 = MyMigration1734314640915;
