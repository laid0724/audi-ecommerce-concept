import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CloudinaryPhotoCroppingMode } from '../enums';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { INJECT_API_ENDPOINT } from '@audi/data';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private endpoint = this.injectApiEndpoint + '/photos';

  constructor(@Inject(INJECT_API_ENDPOINT) private injectApiEndpoint: string,private http: HttpClient) {}

  uploadPhoto(
    file: File,
    croppingMode: CloudinaryPhotoCroppingMode = CloudinaryPhotoCroppingMode.Cover
  ): Observable<any> {
    // see: https://stackoverflow.com/questions/40214772/file-upload-in-angular

    const formData = new FormData();

    formData.append('file', file);

    // headers are immutable, each set method returns a new header and does not update the original header
    // so you need to do it this way, e.g., headers = headers.set()
    // see: https://www.tektutorialshub.com/angular/angular-httpheaders/#set

    let headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers = headers.set('X-CROPPING-MODE', croppingMode);

    return this.http
      .post(`${this.endpoint}`, formData, {
        headers,
        responseType: 'text',
      })
      .pipe(take(1));
  }
}
