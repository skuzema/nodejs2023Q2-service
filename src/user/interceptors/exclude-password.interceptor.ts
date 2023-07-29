import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => this.transformItem(item));
        }
        return this.transformItem(data);
      }),
    );
  }

  private transformItem(item: any): any {
    const transformedItem = { ...item };
    delete transformedItem.password;
    return transformedItem;
  }
}
