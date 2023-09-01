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
  private platform: string = '';
  private tenantName: string = '';
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

  private fetchStatus(
    currentSessionId: string,
    onErrorReceived: (error: string) => void,
    onSessionReceived: (sessionId: string) => void
  ) {
    console.log('fetchStatus starting');
    console.log('currentSessionId:', currentSessionId);
    if (currentSessionId) {
      this.http.get(`https://api.login.broker/${this.tenantName}/auth/status/${currentSessionId}`, {responseType: 'text'})
        .subscribe(
          (data: string) => {
            // Handle the data inside the subscribe callback
            if (data === 'completed') {
              debugger;
              onSessionReceived(this.sessionId);
            } else if (data === 'failed') {
              console.log('Login failed. Try again');
              onErrorReceived(data);
            } else if (data === 'pending') {
              this.hasBeenPending = true;
              this.retryLoginOrGiveUp(onErrorReceived, onSessionReceived);
            } else if (this.hasBeenPending) {
              console.log('Session expired');
              onErrorReceived(data);
            } else {
              console.log('Session not yet available');
              this.retryLoginOrGiveUp(onErrorReceived, onSessionReceived);
            }
          },
          (error) => {
            debugger
            this.handleError(error, onErrorReceived);
          }
        );
    }
  }

  private handleError(error: any, onErrorReceived: (error: string) => void): void {
    console.error(error);
    onErrorReceived(error); // Call the error callback
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

  public startLoginProcess(
    tenantName: string,
    platform: string,
    onSessionReceived: (sessionId: string) => void,
    onErrorReceived: (error: string) => void
  ): void {
    this.tenantName = tenantName;
    this.platform = platform;
    this.sessionId = this.generateRandomString(15);

    window.open(`https://${this.platform}.login.broker/${this.tenantName}/auth/${this.platform}/session/${this.sessionId}`);

    // Wait for the window to open and to save the new session in the API
    setTimeout(() => {
      this.confirmLogin(onErrorReceived, onSessionReceived);
    }, 2000); // Adjust the delay time as needed
  }

  public confirmLogin(onErrorReceived: (error: string) => void, onSessionReceived: (sessionId: string) => void): void {
    this.fetchStatus(this.sessionId, onErrorReceived, onSessionReceived);
  }
}