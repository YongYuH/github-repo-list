# Live demo
https://adoring-jennings-f809ce.netlify.app/
![demo](images/demo.gif)

# How to run this project in local environment
1. install Node.js package manager `yarn` or `npm`
2. install dependencies through `yarn` or `npm`
```bash
yarn
```
or 
```bash
npm install
```
3. start development server
```bash
yarn dev
```
or
```bash
npm run dev
```
4. build and start production server
```bash
yarn build
yarn start
```
or
```bash
npm run build
npm start
```

# Description
### Folder structure
* Define components, hooks, and util functions in a folder as a module.
* Reusable components, hooks, and util functions would be defined in the sibling folders of other module folders.
### Reusable components
* Use `styled-system` to unify style property name of reusable components.
### Type safe
* Generate types of github api through `openapi-typescript` to ensure type safety when access data of github api responses.
* Exhaustive match through `ts-pattern` to ensure all input types would be handled in compile time.
### Styling
* Use one of the css-in-js solutions, `styled-components` to add style to components to avoid css class name naming collision and polyfill styled cross different browsers.
### Debounce
* Reduce the update frequency of fetch urls to avoid too many requests sent in a short time.
### Infinite scroll
* Update trigger condition of the github next page repositories through IntersectionObserver apis.

# License
[MIT](LICENSE)
