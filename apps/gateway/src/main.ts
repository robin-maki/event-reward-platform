import { env } from '@erp/env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = env.GATEWAY_PORT;
  await app.listen(port);
  console.log('Listening on port', port);
  return app;
}

void bootstrap();
