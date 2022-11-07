import moment from 'moment';

export const CreateCardOrderSectionTitle = 'Create Card Order';
export const CustomizePhysicalCardSectionTitle = 'Customize Your Physical Cards';

export const physicalCodesAmount = [50, 100, 150, 200, 400, 600, 800, 1000];

export enum CodesType {
  Physical = 'physical',
  Digital = 'digital',
}

export const CardStandardStyle = 'standard';
export const CardMooStyle = 'moo-size';
export const CardSquareStyle = 'square';

export const defaultCardColor = '#33447c';

export const CardFrontSide = 'Front';
export const CardBackSide = 'Back';

export const FIRST_LINE = 'cardCopyFirstLine';
export const SECOND_LINE = 'cardCopySecondLine';
export const THIRD_LINE = 'cardCopyThirdLine';

export const defaultCopyLines = {
  [FIRST_LINE]: 'travel light,',
  [SECOND_LINE]: 'pick a swag gift you',
  [THIRD_LINE]: 'actually want',
};

export const defaultCMYKColor = { c: 50, m: 45, y: 0, k: 51 };

export const EXPIRATION_DATE_FORMAT = 'YYYY-MM-DD';

export const minValidDateForCodes = moment().add(3, 'months').format(EXPIRATION_DATE_FORMAT);

export const defaultCardCopyLines = {
  line1: 'travel light,',
  line2: 'pick a swag gift you',
  line3: 'actually want',
};

export const landscapeImageWidth = 80;
export const portraitImageWidth = 13;
