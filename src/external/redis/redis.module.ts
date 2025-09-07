import { Module } from '@nestjs/common';
import { CacheModuleOptions, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async (): Promise<CacheModuleOptions> => {
                const store = await redisStore({
                    socket: {
                        host: process.env.REDIS_HOST,
                        port: parseInt(process.env.REDIS_PORT),
                    },
                    password: process.env.REDIS_PASSWORD,
                    ttl: 30 * 24 * 3600 // 30 ngày
                });

                return {
                    store: () => store,
                };
            },
        }),
    ],
    exports: [CacheModule],
})
export class RedisModule { }