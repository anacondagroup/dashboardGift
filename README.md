This project was bootstrapped with [Create React Dashboard](https://github.com/facebook/create-react-app).

## Backend setup
create file .env.development.local
- REACT_APP_PROXY your local backend host.
- REACT_APP_API_HOST your local frontend host, default is http://localhost:3000 if you want to setup without proxy leave it as REACT_APP_PROXY
- REACT_APP_DASHBOARD_HOST the same as REACT_APP_API_HOST but for different purpose

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Development doc

### Libraries
- view — [react](https://reactjs.org/)
- state — [redux](https://redux.js.org/)
- side-effects — [redux-observable](https://redux-observable.js.org/)
- styling — [material-ui](https://material-ui.com/)

### Containers and components
Containers — smart components which connected to redux state, implements side effects, contains routing. No styling.
Components — implement layout, styling. No side effects or redux state connection.

### Redux and rxjs
Redux for state structure rxjs for actions flow management. Keep data in state, logic in epics. Each side effect should be injected as dependency in root epic.

### Tests
- component example — [DashboardHeader](./src/components/Dashboard/tests/dashboardHeader.spec.js)
- container example — [Dashboard](src/modules/Dashboard/dashboard.spec.js)
- epic example — [Auth](./src/store/auth/tests/auth.epic.spec.js)
- reducer example — [Auth request](./src/store/auth/auth-request/tests/auth-request.reducer.spec.js)

## CSS and styling
Main theme is here — [Alyce theme](./src/styles/alyce-theme.js)
Use vars from global theme. More about theme [here](https://material-ui.com/customization/themes/)
Do not write your own base components or classes, everything defined in material UI, for example [Typography](https://material-ui.com/style/typography/)

```
const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    background: theme.palette.primary.main,
  }
});

const Header = ({ title, classes }) => (
    <Paper className={classes.root}>
        <Typography variant="h1">
            { title }
        </Typography>
    </Paper>
);

export default withStyles(styles)(Header)

```

## Learn More

You can learn more in the [Create React Dashboard documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
