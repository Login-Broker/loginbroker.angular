import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AngularLoginBrokerLibraryService {
  private MAX_RETRY_COUNT = 60;
  private sessionId: string = '';
  private retryCount = 0;
  private hasBeenPending = false;

  constructor(private http: HttpClient) {}

  private generateRandomString(length: number): string {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      const randomChar = allowedChars.charAt(randomIndex);
      randomString += randomChar;
    }

    return randomString;
  }

  private fetchStatus(currentSessionId: string, onErrorReceived: (error: string) => void, onSessionReceived: (sessionId: string) => void): Observable<string> {
    console.log('fetchStatus starting');
    console.log('currentSessionId:', currentSessionId);
    if (currentSessionId) {
      return this.http.get<string>(`https://api.login.broker/${tenantName}/auth/status/${currentSessionId}`).pipe(
        catchError(error => {
          onErrorReceived(error); // Call the error callback
          return throwError(error);
        })
      );
    }
    return throwError('Invalid Session ID');
  }

  private handleStatusResponse(data: string, onErrorReceived: (error: string) => void, onSessionReceived: (sessionId: string) => void): void {
    if (data === 'completed') {
      onSessionReceived(this.sessionId); // Call the session callback
    } else if (data === 'failed') {
      console.log('Login failed. Try again');
      onErrorReceived(data); // Call the error callback
    } else if (data === 'pending') {
      this.hasBeenPending = true;
      this.retryLoginOrGiveUp(onErrorReceived, onSessionReceived);
    } else if (this.hasBeenPending) {
      console.log('Session expired');
      onErrorReceived(data); // Call the error callback
    } else {
      console.log('Session not yet available');
      this.retryLoginOrGiveUp(onErrorReceived, onSessionReceived);
    }
  }

  private retryLoginOrGiveUp(onErrorReceived: (error: string) => void, onSessionReceived: (sessionId: string) => void): void {
    if (this.retryCount < this.MAX_RETRY_COUNT) {
      this.retryCount++;
      timer(2000).pipe(
        take(1),
        tap(() => this.confirmLogin(onErrorReceived, onSessionReceived))
      ).subscribe();
    } else {
      console.log('Max retries reached while pending. Giving up.');
      onErrorReceived('Max retries reached while pending. Giving up.'); // Call the error callback
    }
  }

  private handleError(error: any, onErrorReceived: (error: string) => void): void {
    console.error(error);
    onErrorReceived(error); // Call the error callback
  }

  public startLoginProcess(
    tenantName: string,
    platform: string,
    onErrorReceived: (error: string) => void,
    onSessionReceived: (sessionId: string) => void
  ): void {
    const newSessionId = this.generateRandomString(15);
    window.open(`https://${platform}.login.broker/${tenantName}/auth/${platform}/session/${newSessionId}`);

    // Wait for the window to open and to save the new session in the API
    setTimeout(() => {
      this.sessionId = newSessionId;
      this.confirmLogin(onErrorReceived, onSessionReceived);
    }, 2000); // Adjust the delay time as needed
  }

  public confirmLogin(onErrorReceived: (error: string) => void, onSessionReceived: (sessionId: string) => void): void {
    if (this.sessionId) {
      this.fetchStatus(this.sessionId, onErrorReceived, onSessionReceived).subscribe(data =>
        this.handleStatusResponse(data, onErrorReceived, onSessionReceived)
      );
    }
  }
}