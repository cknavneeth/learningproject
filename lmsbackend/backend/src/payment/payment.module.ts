import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { PaymentController } from './controller/payment.controller';
import { PAYMENT_REPOSITORY, PAYMENT_SERVICE } from './constants/payment-constant';
import { PaymentService } from './service/payment.service';
import { paymentRepository } from './repository/payment.repository';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Payment.name,schema:PaymentSchema}]),
        AuthenticationModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
        ConfigModule
    ],
    controllers:[PaymentController],
    providers:[
        {
            provide:PAYMENT_SERVICE,
            useClass:PaymentService
        },
        {
            provide:PAYMENT_REPOSITORY,
            useClass:paymentRepository
        }
    ],
    exports:[PAYMENT_SERVICE,PAYMENT_REPOSITORY]
})
export class PaymentModule {}
