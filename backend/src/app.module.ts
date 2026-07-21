import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ChatModule } from './chat/chat.module';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [AuthModule, PrismaModule, ProductModule, ChatModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
