export const route1 = {
  path: '/',
  match: (preResult)=>'match',
  error: (err)=>'error'
}

export const route2 = {
  path: '/',
  pattern: {
    path: '/item/:id',
    options: { // just test if options pass to pathToRegexp correctly
      sensitive: true
    }
  }
}

export const route3 = {
  path: '/',
  pattern: {
    path: '/user/:userId/item/:id'
  }
}
