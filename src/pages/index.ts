import { lazy } from "react"

export const Login = lazy(() => import("./Login"))
export const Main = lazy(() => import("./Main"))
export const MatchPreview = lazy(() => import("./MatchPreview"))
export const LiveScore = lazy(() => import("./LiveScore"))
export const UserMgmt = lazy(() => import("./UserMgmt"))
export const LeagueMgmt = lazy(() => import("./LeagueMgmt"))
export const TeamMgmt = lazy(() => import("./TeamMgmt"))
export const ProtoMatchmap = lazy(() => import("./ProtoMatchmap"))
export const ProtoScoreMgmt = lazy(() => import("./ProtoScoreMgmt"))
