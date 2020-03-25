import React from 'react'
import {Redirect} from 'react-router-dom'

import Home from '../pages/Home'
import Recommend from '../pages/Recommend'
import Singers from '../pages/Singers'
import Rank from '../pages/Rank'
import Album from '../pages/Album'
import Singer from '../pages/Singer'
import Search from '../pages/Search'

export default [
  {
    path: '/',
    component: Home,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to={'/recommend'} />
      },
      {
        path: '/recommend',
        component: Recommend,
        routes: [
          {
            path: '/recommend/:id',
            component: Album
          }
        ]
      },
      {
        path: '/singers',
        component: Singers,
        key: 'singers',
        routes: [
          {
            path: '/singers/:id',
            component: Singer
          }
        ]
      },
      {
        path: '/rank',
        component: Rank,
        routes: [
          {
            path: '/rank/:id',
            component: Album
          }
        ]
      },
      {
        path: '/search',
        exact: true,
        key: 'search',
        component: Search
      },
      {
        path: '/album/:id',
        exact: true,
        key: 'album',
        component: Album
      }
    ]
  }
]
