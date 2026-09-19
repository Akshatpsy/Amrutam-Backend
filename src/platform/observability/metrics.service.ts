import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
    getStatus() {
        return { status: 'metrics-ready' };
    }
}