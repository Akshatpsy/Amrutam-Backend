import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: unknown) {
        if (value === undefined || value === null) {
            throw new BadRequestException('Invalid request payload');
        }
        return value;
    }
}