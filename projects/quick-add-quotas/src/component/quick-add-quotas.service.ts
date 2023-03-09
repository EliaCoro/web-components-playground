import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuickAddQuotasService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllQuestionsAndSubquestions(sid: number, token: string) {
    return this.http.get(`
    /index.php/admin/survey/sa/getAllQuestionsAndSubquestions/surveyid/${sid}?YII_CSRF_TOKEN=${token}
    `)
    // return this.http.get<Question[]>(this.baseUrl + 'api/Questions/GetAllQuestionsAndSubquestions/' + sid + '?token=' + token);
  }
}
