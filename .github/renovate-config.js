module.exports = {
  allowedCommands: [".*"],
  repositories: [
    {
      repository: "dotnet/nbgv",
      baseBranches: ["renovate/reconfigure"],
      useBaseBranchConfig: "merge",
    },
  ],
};
