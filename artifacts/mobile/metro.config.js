const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// The mobile app pins the React version that Expo SDK 54 / React Native 0.81
// require, while other workspace packages use the catalog React. Workspace
// libraries consumed here (e.g. @workspace/api-client-react) would otherwise
// resolve their own copies, giving two Reacts / two React Query contexts in
// one bundle. Force these singletons to resolve from this app.
const SINGLETONS = ["react", "react-dom", "@tanstack/react-query"];
const appOrigin = path.join(__dirname, "package.json");

const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = SINGLETONS.some(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`),
  );
  const ctx = isSingleton ? { ...context, originModulePath: appOrigin } : context;
  return upstreamResolveRequest
    ? upstreamResolveRequest(ctx, moduleName, platform)
    : ctx.resolveRequest(ctx, moduleName, platform);
};

module.exports = config;
