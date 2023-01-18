import {HttpErrorResponse} from "@angular/common/http";

export abstract class ErrorService {

  static MSG_SERVICE_UNAVAILABLE = "Service is unavailable. Try again later.";
  static MSG_GENERIC_ERROR = "Something went wrong. Contact admin."
  static MSG_STATS_NOT_LOADED = "Couldn't load creature stats. If this is an offspring, it is possible its stats weren't created at all. Contact admin for new stats.";
  static MSG_CANNOT_RENAME = "Couldn't change creature name."

  public static getErrorMessage(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      if (error.status == 503) {
        errorMessage = this.MSG_SERVICE_UNAVAILABLE;
      } else {
        errorMessage = this.MSG_GENERIC_ERROR;
      }
    }
    return errorMessage;
  }
}
