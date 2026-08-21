import { Sequelize } from 'sequelize-typescript';
import { Tenant } from './models/tenant.model';
import { User, UserRole } from './models/user.model';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

async function runSeed() {
  console.log('Starting seed...');

  const sequelize = new Sequelize({
    dialect: (process.env.DB_DIALECT as any) || 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    models: [Tenant, User],
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Ensure tables exist
    await sequelize.sync({ alter: true });

    // Check if tenants exist
    const count = await Tenant.count();
    if (count > 0) {
      console.log('Database already seeded. Exiting.');
      return;
    }

    const tenantA = await Tenant.create({ name: 'Acme Corp' });
    const tenantB = await Tenant.create({ name: 'Globex' });

    const passwordHash = await bcrypt.hash('password123', 10);

    // Tenant A Users
    await User.create({
      email: 'karthik93454@gmail.com',
      password: passwordHash,
      role: UserRole.TENANT_ADMIN,
      tenantId: tenantA.id,
    });

    await User.create({
      email: 'santhosh@gmai.com',
      password: passwordHash,
      role: UserRole.OPERATOR,
      tenantId: tenantA.id,
    });

    // Tenant B Users
    await User.create({
      email: 'admin@gmail.com',
      password: passwordHash,
      role: UserRole.TENANT_ADMIN,
      tenantId: tenantB.id,
    });

    console.log('Seed completed successfully!');
    console.log('Test Users:');
    console.log('- admin@acme.com / password123 (TENANT_ADMIN)');
    console.log('- operator@acme.com / password123 (OPERATOR)');
    console.log('- admin@globex.com / password123 (TENANT_ADMIN)');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await sequelize.close();
  }
}

runSeed();
