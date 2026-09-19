import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

type RequestLike = {
    headers?: Record<string, string | string[] | undefined>;
    requestId?: string;
};

type ResponseLike = {
    setHeader: (name: string, value: string) => void;
};

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: RequestLike, res: ResponseLike, next: () => void): void {
        const headerValue = req.headers?.['x-request-id'];
        const requestId =
            typeof headerValue === 'string'
                ? headerValue
                : Array.isArray(headerValue)
                    ? headerValue[0]
                    : randomUUID();

        req.requestId = requestId;
        res.setHeader('x-request-id', requestId);
        next();
    }
}