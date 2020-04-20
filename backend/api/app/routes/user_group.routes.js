const express = require('express');
const router = express.Router();
const auth = require("../auth/auth.js");

const user_groups = require("../controllers/user_group.controller.js");

//Create user_group
router.post("/groups/:groupId/members",auth.authenticateToken, user_groups.create);

//Get all user_groups
router.get("/groups/members/global", user_groups.findAll);

//Get all user's groups
router.get("/users/:userid/groups", user_groups.findAllUsersGroups);

//Get all groups's users
router.get("/groups/:groupId/members", user_groups.findAllGroupsMembers);

//Delete user from group
router.delete("/groups/:groupId/members/:userid",auth.authenticateToken, user_groups.deleteUserFromGroup);

//Delete all user's groups
router.delete("/users/:userid/groups",auth.authenticateToken, user_groups.deleteAllUsersGroups);

//Delete all groups's users
router.delete("/groups/:groupId/members",auth.authenticateToken, user_groups.deleteAllGroupsMembers);

//Delete all user_groups
router.delete("/groups/members/global",auth.authenticateToken, user_groups.deleteAll);

module.exports = router;
