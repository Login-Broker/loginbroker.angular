import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { catchError, retryWhen, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AngularLoginBrokerLibraryService {
  private MAX_RETRY_COUNT = 60; // Maximum retry count (2 minutes with 2-second intervals)

  constructor(private http: HttpClient) {}

  private generateRandomString(length: number): string {
    const allowedChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      const randomChar = allowedChars.charAt(randomIndex);
      randomString += randomChar;
    }

    return randomString;
  }

  private handleError(error: any): void {
    console.error(error);
    // Handle the error as needed
  }

  private fetchStatus(
    tenantName: string,
    currentSessionId: string
  ): Observable<string> {
    return this.http
      .get(`https://api.login.broker/${tenantName}/auth/status/${currentSessionId}`, {
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          this.handleError(error);
          return [];
        })
      );
  }

  startLoginProcess(
    tenantName: string,
    platform: string
  ): Observable<string | null> {
    const newSessionId = this.generateRandomString(15);
    window.open(
      `https://${platform}.login.broker/${tenantName}/auth/${platform}/session/${newSessionId}`
    );

    // Wait for the window to open and save the new session in the API
    return timer(2000).pipe(
      switchMap(() => {
        return this.fetchStatus(tenantName, newSessionId).pipe(
          retryWhen((errors) =>
            errors.pipe(
              switchMap((error, index) => {
                if (index < this.MAX_RETRY_COUNT) {
                  // Retry after 2 seconds
                  return timer(2000);
                }
                throw new Error('Max retries reached while pending. Giving up.');
              }),
              take(this.MAX_RETRY_COUNT)
            )
          )
        );
      })
    );
  }
}