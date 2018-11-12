

<h1 align="center">
   🍀
  <h3 align="center">Clover</h3>
  <p align="center" style="font-size: 0.5em">A site parser and api for the internet portal at Augustine University</p>
</h1>

<p align="center">
     <a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg"></a> 
     <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
     <a href="https://github.com/facebook/jest/pulls"><img src="https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg" alt="PR's welcome"></a>

</p>

## Getting started

1. Install with yarn

```
yarn add clover
```

or with npm

```
npm install clover
```
  
## TL;DR
First off, i'd like to point out that clover is **NOT**, I repeat **NOT** a generic site parser, it was built with my Univerisity's internet portal applictaion in mind. That being said, if you'd like to use parts of the code to perhaps build your own, you're more than welcome to do so. This package will be especially useful to CS majors at AUI, it provides casses for parsing and identification of static ```html``` content received from the server as well as some nicer higher level abstractions like ```APIs``` for making ```POST``` and ```GET``` calls to the applications server. All these are exposed via a very clean and simple ```API```. It is worthy of note however, that the this library uses raw string pattern matching to identify pages and this easily gets broken when the HTML served by the server changes. I will try to keep this package as updated as possible. If you find that the package doesn't work properly and you're sure it's an issue with page identification, simply send a PR adding detection support for the new pages as well as tests. That wasn't so long, now was it? 😊

