import { identity, ifElse, any, propEq, append, and, pipe } from 'ramda';

export const getTemplatesWithDefault = (defaultTemplate, templates) =>
  ifElse(
    pipe(any(propEq('subject', '')), and(propEq('subject', '', defaultTemplate))),
    identity,
    append(defaultTemplate),
  )(templates);
