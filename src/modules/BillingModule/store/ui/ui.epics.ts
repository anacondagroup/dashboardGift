import { Epic } from 'redux-observable';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { TrackEvent } from '@alycecom/services';

import { downloadGiftDepositForm } from './ui.actions';

const downloadGiftDepositFormEpic: Epic = (action$, state$, { apiService, downloadFile }) =>
  action$.pipe(
    filter(downloadGiftDepositForm.match),
    switchMap(() =>
      apiService.getFile('/api/v1/reporting/resources/gift-deposit-form-template').pipe(
        tap(blob => {
          downloadFile(blob, 'Gift Deposit Form.pdf');
        }),
        map(() =>
          TrackEvent.actions.trackEvent({
            name: 'Download gift deposit form — clicked',
          }),
        ),
      ),
    ),
  );

export default [downloadGiftDepositFormEpic];
