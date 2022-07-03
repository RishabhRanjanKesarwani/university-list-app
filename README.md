# UniList - A database of universities across the world

Created by [Rishabh Ranjan Kesarwani](https://github.com/RishabhRanjanKesarwani).

## Tech stack used

1. `ReactJs`
2. `Typescript`
3. `Material UI` for UI components and responsiveness
4. `React Testing Library` for testing the application
5. `Mock Service Worker (msw)` for mocking API response
6. `React Router Dom` for routing
7. `ESLint` for linting
8. `Prettier` for formatting the code
9. `Web storage` for persisting data
10. `Create React App` for starting up the project

## Features of the application

### Header
A responsive header which contains routes for university-list, subscribe and favourites pages.\
It has a text-based-logo, on click of which redirects users to home page.\
For small screens, the header shows a menu icon, on click of which opens a menu containing all the routes.

### Home Page
Landing page showcasing 2 cards - one for each of university-list and subscribe pages.\
Each card has `Learn more` CTA which redirects user to the corresponding route.

### University List Page
Lists all the universities for the given name and/or country.
The list of universities is sorted - country-wise and then name-wise for every country.
Country input has default value `India`. Hence, the first list which appears on the page contains all the universities in India.
For an input resulting into an empty array, a component to indicate the same loads up.
On clicking `add to favourites` button against any university, that university is added to the web storage. A success toast shows up informing the user that the action was completed.
If a user tries to add the same university to favourites more than once, an info toast appears to inform the same.
The page shows a loading component when until the list of universities is not recevied from the API
When any of the inputs - name or country - change, the API is called. The API call is debounced.

### Subscribe Page
Email is validated when submitted. For an invalid email, an error toast is rendered.
If an email is submitted, it is validated whether the email exists or not.
If it exists, an info toast informing about the duplicacy is rendered. Otherwise, a success toast is rendered.
The emails which subscribed are stored in the web storage.
A list of subscribers is also visible in this page.

### Favourites Page
The list of universities which were marked favourites is displayed.
The data is fetched from web storage.
If there is no fabourite university, an illustration to show the same is rendered.
A button to remove a university from favourites is provided against every university. When clicked, the item is removed from the web storage

### Page Not Found
For any route which does not exist in the application, this page loads up.
It contains an illustration to convey the same.
It also contains CTAs to redirect to the popular routes - Home, List and Subscribe.

## What to expect in next release?

1. A persistent database and to store information such as subscribed emails, favourite universities, user data, etc.
2. Login/Logout.
3. Sorting on tables

## Steps to run in local

### 1. `git clone <repo>`
Clone the repo in your desired folder

### 2. `cd university-list-app`
Move into the application folder

### 3. `npm install`
Install all the dependencies (Ensure that you have downloaded node and npm before this step)

### 4. `npm start`
You're all set!. Go to `localhost:3000` to use the application.

## Other available cripts

In the project directory, you can run:

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run test:coverage`

Launches the test runner and reports the test coverage.\
Currently the coverage metrics for `all files` are as follows:\
Statements: **84.25%**
Branches: **68.08%**
Functions: **88.4%**
Lines: **84.58%**

### `npm run lint`

Report all the vulnerabilities and errors

### `npm run lint:fix`

Fix all the lint errors

### `npm run format`

Formats all the files using prettier

## Learn more

To learn more about the project, please feel free to connect with [Rishabh Ranjan Kesarwani](https://www.linkedin.com/in/rishabhranjankesarwani/) on LinkedIn.
