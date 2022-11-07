import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { GIFT_REPORT } from './giftReport.types';
import { transformGiftReportRequest } from './giftReport.transformers';

export const giftReportEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage, ERRORS } },
) =>
  action$.pipe(
    ofType(GIFT_REPORT.SEND),
    mergeMap(({ meta }) =>
      apiService
        .post(`/enterprise/dashboard/send-gift-report/`, {
          body: transformGiftReportRequest(meta),
        })
        .pipe(
          map(() =>
            showGlobalMessage({ text: 'Success! Your gift invitation report has been sent.', type: 'success' }),
          ),
          catchError(errorHandler({ message: ERRORS.SOMETHING_WRONG })),
        ),
    ),
  );

export const giftReportEpics = [giftReportEpic];
