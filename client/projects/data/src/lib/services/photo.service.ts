import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private endpoint = '/api/photos';

  constructor(private http: HttpClient) {}

  uploadPhoto(file: File): Observable<any> {
    // see: https://stackoverflow.com/questions/40214772/file-upload-in-angular
    const formData = new FormData();
    formData.append('file', file);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post(`${this.endpoint}`, formData, {
        headers,
        responseType: 'text',
      })
      .pipe(take(1));
  }
}
