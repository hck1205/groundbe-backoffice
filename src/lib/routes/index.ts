import {
  Login,
  Main,
  MatchPreview,
  LiveScore,
  UserMgmt,
  ProtoMatchmap,
  ProtoScoreMgmt,
  LeagueMgmt,
  TeamMgmt
} from "pages"

export const routes = [
  {
    path: ["/", "/login"],
    page: Login,
    exact: true
  },
  {
    path: "/main",
    page: Main,
    exact: true
  },
  {
    path: "/match-preview",
    page: MatchPreview,
    exact: true
  },
  {
    path: "/match-livescore",
    page: LiveScore,
    exact: true
  },
  {
    path: "/user-mgmt",
    page: UserMgmt,
    exact: true
  },
  {
    path: "/league-mgmt",
    page: LeagueMgmt,
    exact: true
  },
  {
    path: "/team-mgmt",
    page: TeamMgmt,
    exact: true
  },
  {
    path: "/proto-matchmap",
    page: ProtoMatchmap,
    exact: true
  },
  {
    path: "/proto-score",
    page: ProtoScoreMgmt,
    exact: true
  }

  // {
  //   path: "/product/:direction(\\d+|category|department)?/:id?",
  //   page: Product,
  //   exact: true
  // },
]
