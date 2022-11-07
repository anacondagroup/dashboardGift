import React, { memo, useMemo } from 'react';
import { AlyceTheme, LoadingLabel } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: '2.5rem',
    minHeight: '2.5rem',
  },
  title: {
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: '1rem',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color: palette.grey.main,
  },
}));

export interface IKpiValueProps {
  value: number | string | React.ReactElement;
  title: string;
  isLoading: boolean;
  className?: string;
}

const KpiValue = ({ value, title, isLoading, className }: IKpiValueProps) => {
  const classes = useStyles();

  const formattedValue = useMemo(() => {
    if (isLoading) {
      return <LoadingLabel mt={2.5} width={36} height={4} />;
    }

    return <span>{value}</span>;
  }, [value, isLoading]);

  return (
    <div className={classNames(classes.wrapper, className)} data-testid={`kpi-value-${title}`}>
      <div className={classes.value}>{formattedValue}</div>
      <div className={classes.title}>{title}</div>
    </div>
  );
};

export default memo(KpiValue);
