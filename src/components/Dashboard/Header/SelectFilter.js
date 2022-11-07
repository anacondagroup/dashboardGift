import { withStyles } from '@mui/styles';
import { SelectFilter } from '@alycecom/ui';

const styles = theme => ({
  root: {
    width: 170,
    marginLeft: theme.spacing(1),
  },
});

export default withStyles(styles)(SelectFilter);
