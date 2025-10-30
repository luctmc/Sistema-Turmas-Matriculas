import { createApp } from './app.js';
import { initializeDatabase } from './database/index.js';
import { appConfig } from './config/database.js';

const bootstrap = async () => {
  try {
    await initializeDatabase();
    const app = createApp();
    app.listen(appConfig.port, () => {
      console.log(`🚀 API rodando na porta ${appConfig.port}`);
    });
  } catch (error) {
    if (error?.name === 'SequelizeConnectionRefusedError') {
      console.error('❌ Não foi possível conectar ao banco de dados. Certifique-se de que o PostgreSQL está em execução.');
      console.error('   Dica: execute "docker compose up db" ou atualize o DB_HOST/DB_PORT no arquivo .env.');
    } else if (error?.name === 'SequelizeHostNotFoundError') {
      console.error('❌ Host do banco de dados não encontrado. Confira o valor de DB_HOST no arquivo .env.');
    } else {
      console.error('Erro ao iniciar aplicação', error);
    }
    process.exit(1);
  }
};

bootstrap();
