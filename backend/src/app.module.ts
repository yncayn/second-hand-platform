import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [AuthModule, PrismaModule, ProductModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
