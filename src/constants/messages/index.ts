// Login Messages
const LOGIN_MSG = {
  title_fail: "Login Failed",
  verify_fail_url: "Please check token verification url",
  verify_fail_expired:
    "Login session is expired, window will be reloaded after renewing the token",
  login_fail: "If you have a touble with login, Please contact to Manager"
}

const PROTO_MSG = {
  title_proto_matchmap: "Proto Matchmap",
  title_proto_score: "Proto Score",
  matchmap_delete_success: "Deleted Sucessfully",
  matchmap_reserve_success:
    "Matchmap reserve setting has sucessfully completed",
  matchmap_delete_fail: "Matchmap informtion is not found",
  matchmap_fetch_data: "Loading Matchmap game list",
  score_update_success: "successfully updated"
}

const MATCH_MSG = {
  title_match_preview_update: "Match Preview Update",
  match_preview_update_fail:
    "Failed to update Match Preview. Please check login token id",
  match_preview_update: "Updating match preivew data.."
}

const SCORE_MSG = {
  title_live_score_update: "Live Score Update",
  live_score_update_success: "Live Score has updated successfully"
}

const TEAM_MSG = {
  title_team_update: "Team Information Update",
  team_info_update_success: "Team information has changed successfully",
  team_logo_update_success: "Team logo has changed successfully"
}

const USER_MSG = {
  user_info_update: "User Information Update",
  user_info_update_success: "User information has changed successfully",
  user_info_update_fail_identical:
    "You cannot update user permission same as previous",
  user_image_update_success: "User profile image has successfully updated",
  user_profile_delete_success: "User profile has deleted successfully",
  user_profile_updated_success: "User profile has updated successfully",
  user_profile_added_success: "User profile has added successfully"
}

const LEAGUE_MSG = {
  title_league_update: "League Information Update",
  league_info_update_success: "League information has changed successfully",
  league_logo_update_success: "League logo has changed successfully"
}

export {
  LOGIN_MSG,
  PROTO_MSG,
  MATCH_MSG,
  TEAM_MSG,
  USER_MSG,
  LEAGUE_MSG,
  SCORE_MSG
}
