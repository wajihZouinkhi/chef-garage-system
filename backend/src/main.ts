import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Configure CORS for production
    app.enableCors({
        origin: [
            'http://localhost:3000', // Development
            'https://*.netlify.app',  // Netlify deployments
            process.env.APP_URL || 'http://localhost:3000' // Custom domain
        ],
        credentials: true,
    });
    
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();
